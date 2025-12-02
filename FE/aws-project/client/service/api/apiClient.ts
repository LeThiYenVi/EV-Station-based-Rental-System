import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG, getFullUrl } from "../config/apiConfig";

// Response wrapper interface matching your backend ApiResponse
export interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}

// Error response interface
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string>;
}

class ApiClient {
  private instance: AxiosInstance;
  private publicInstance: AxiosInstance; // For public endpoints without credentials
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    // Use configured BASE_URL + API_PREFIX; in dev BASE_URL is '' so requests go via Vite proxy '/api'
    const baseURL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`;

    // Main instance with credentials for authenticated requests
    this.instance = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // For cookie-based refresh tokens
    });

    // Public instance WITHOUT any credentials or cookies
    this.publicInstance = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        // Explicitly set to avoid any auth headers
      },
      withCredentials: false, // CRITICAL: No cookies
    });

    console.log("API Client initialized with baseURL:", baseURL);
    console.log("Public instance withCredentials:", false);
    console.log("Authenticated instance withCredentials:", true);

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for PUBLIC instance - explicitly remove auth headers
    this.publicInstance.interceptors.request.use(
      (config) => {
        // Ensure NO Authorization header is sent for public endpoints
        delete config.headers.Authorization;
        console.log("Public request interceptor:", {
          url: config.url,
          method: config.method,
          headers: config.headers,
          withCredentials: config.withCredentials,
        });
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Request interceptor - ONLY for authenticated instance
    this.instance.interceptors.request.use(
      (config) => {
        // Always add access token for authenticated requests
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log("Authenticated request interceptor:", {
          url: config.url,
          method: config.method,
          hasAuth: !!config.headers.Authorization,
          withCredentials: config.withCredentials,
        });
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor for both instances
    const responseInterceptor = (response: AxiosResponse) => {
      console.log("Response received:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
      return response;
    };

    // Error interceptor for PUBLIC instance - just log and reject
    const publicErrorInterceptor = async (error: AxiosError<ApiError>) => {
      console.error("Public request failed:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      // DO NOT try to refresh token for public endpoints
      return Promise.reject(error);
    };

    // Error interceptor for AUTHENTICATED instance - with token refresh
    const authErrorInterceptor = async (error: AxiosError<ApiError>) => {
      console.error("Authenticated request failed:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 errors (unauthorized) - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Avoid concurrent refresh storms
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          console.log("Attempting token refresh...");
          this.refreshPromise = this.instance
            .post("/auth/refresh")
            .then((refreshResponse) => {
              const { accessToken, idToken } =
                refreshResponse?.data?.data || {};
              if (!accessToken)
                throw new Error("No accessToken in refresh response");
              localStorage.setItem("accessToken", accessToken);
              if (idToken) localStorage.setItem("idToken", idToken);
              return accessToken as string;
            })
            .catch((refreshError) => {
              console.error("Token refresh failed, logging out...");
              localStorage.clear();
              // During dev, avoid hard redirects to keep page state visible
              // window.location.href = "/login";
              throw refreshError;
            })
            .finally(() => {
              this.isRefreshing = false;
            });
        }

        try {
          const newAccessToken = await (this.refreshPromise as Promise<string>);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return this.instance(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    };

    // Apply interceptors - DIFFERENT for each instance
    this.publicInstance.interceptors.response.use(
      responseInterceptor,
      publicErrorInterceptor,
    );
    this.instance.interceptors.response.use(
      responseInterceptor,
      authErrorInterceptor,
    );
  }

  // Helper to check if endpoint is public
  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      "/auth/register",
      "/auth/verify-otp",
      "/auth/confirm", // OTP verification endpoint
      "/auth/login",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/callback",
      "/auth/url",
    ];
    return publicEndpoints.some((endpoint) => url.includes(endpoint));
  }

  // GET request
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.isPublicEndpoint(url)
      ? this.publicInstance
      : this.instance;
    const response: AxiosResponse<ApiResponse<T>> = await instance.get(
      url,
      config,
    );
    return response.data;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.isPublicEndpoint(url)
      ? this.publicInstance
      : this.instance;
    console.log("POST request:", {
      url,
      isPublic: this.isPublicEndpoint(url),
      instance: this.isPublicEndpoint(url) ? "publicInstance" : "instance",
      method: "POST",
      data: data,
    });
    const response: AxiosResponse<ApiResponse<T>> = await instance.post(
      url,
      data,
      config,
    );
    console.log("POST response:", response.status, response.data);
    return response.data;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.isPublicEndpoint(url)
      ? this.publicInstance
      : this.instance;
    const response: AxiosResponse<ApiResponse<T>> = await instance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.isPublicEndpoint(url)
      ? this.publicInstance
      : this.instance;
    const response: AxiosResponse<ApiResponse<T>> = await instance.patch(
      url,
      data,
      config,
    );
    return response.data;
  }

  // DELETE request
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = this.isPublicEndpoint(url)
      ? this.publicInstance
      : this.instance;
    const response: AxiosResponse<ApiResponse<T>> = await instance.delete(
      url,
      config,
    );
    return response.data;
  }

  // Get raw axios instance if needed
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
