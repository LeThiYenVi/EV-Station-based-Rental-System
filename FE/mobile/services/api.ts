import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ENV_CONFIG } from "@/config/env";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/storage";
import { ApiResponse, AuthResponse } from "@/types";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG.API_BASE_URL,
  timeout: ENV_CONFIG.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    // Only add Authorization header if token exists and is valid
    if (token && token.trim() !== "" && token !== "null" && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse<T> and return just the data
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          // No refresh token, logout user
          await clearTokens();
          throw error;
        }

        // Call refresh token endpoint
        const response = await axios.post<ApiResponse<AuthResponse>>(
          `${ENV_CONFIG.API_BASE_URL}/api/auth/refresh`,
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
            },
          }
        );

        const authData = response.data.data;

        // Save new tokens
        await setTokens(authData.accessToken, authData.refreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data
      ? (error.response.data as any).message || "Request failed"
      : error.message || "Network error";

    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export default api;
