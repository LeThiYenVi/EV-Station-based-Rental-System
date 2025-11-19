import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

// API Configuration
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request Interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }

    // Log request in dev mode
    if (__DEV__) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Log response in dev mode
    if (__DEV__) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.status
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in dev mode
    if (__DEV__) {
      console.error(
        `[API Error] ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        }`,
        error.response?.status,
        error.message
      );
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(
            `${API_CONFIG.baseURL}/api/auth/refresh`,
            null,
            {
              headers: {
                Cookie: `refresh_token=${refreshToken}`,
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Store new tokens
          await SecureStore.setItemAsync("accessToken", accessToken);
          if (newRefreshToken) {
            await SecureStore.setItemAsync("refreshToken", newRefreshToken);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        // You can emit an event here to redirect to login screen
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = getErrorMessage(error);

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

// Helper function to extract error messages
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as any;
    return data?.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response
    return "Network error. Please check your connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
}

export default apiClient;
