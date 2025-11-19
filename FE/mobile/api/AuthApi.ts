import apiClient from "./apiClient";
import * as SecureStore from "expo-secure-store";
import {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotUserPasswordRequest,
  ResetUserPasswordRequest,
  ChangeUserPasswordRequest,
  VerifyAccountRequest,
  GoogleOAuthUrlResponse,
} from "@/types";

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const AuthApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/api/auth/register",
      data
    );
    return response.data.data;
  },

  /**
   * Login user
   * Stores access and refresh tokens in SecureStore
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/api/auth/login",
      data
    );
    const authData = response.data.data;

    // Store tokens securely
    await SecureStore.setItemAsync("accessToken", authData.accessToken);
    await SecureStore.setItemAsync("refreshToken", authData.refreshToken);
    if (authData.idToken) {
      await SecureStore.setItemAsync("idToken", authData.idToken);
    }

    return authData;
  },

  /**
   * Logout user
   * Removes tokens from SecureStore
   */
  async logout(): Promise<void> {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      try {
        await apiClient.post("/api/auth/logout", { token });
      } catch (error) {
        console.error("Logout API error:", error);
        // Continue with local cleanup even if API call fails
      }
    }

    // Clear stored tokens
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("idToken");
  },

  /**
   * Refresh access token
   * Called automatically by axios interceptor
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<{ data: AuthResponse }>(
      "/api/auth/refresh",
      null,
      {
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      }
    );

    const authData = response.data.data;

    // Update stored tokens
    await SecureStore.setItemAsync("accessToken", authData.accessToken);
    if (authData.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", authData.refreshToken);
    }

    return authData;
  },

  /**
   * Request password reset code
   */
  async forgotPassword(data: ForgotUserPasswordRequest): Promise<void> {
    await apiClient.post("/api/auth/forgot-password", data);
  },

  /**
   * Reset password with code
   */
  async resetPassword(data: ResetUserPasswordRequest): Promise<void> {
    await apiClient.post("/api/auth/reset-password", data);
  },

  /**
   * Change password (requires authentication)
   */
  async changePassword(data: ChangeUserPasswordRequest): Promise<void> {
    await apiClient.post("/api/auth/change-password", data);
  },

  /**
   * Verify account with email code
   */
  async confirmAccount(data: VerifyAccountRequest): Promise<void> {
    await apiClient.post("/api/auth/confirm", data);
  },

  /**
   * Get Google OAuth URL
   */
  async getGoogleOAuthUrl(): Promise<string> {
    const response = await apiClient.post<{ data: Record<string, string> }>(
      "/api/auth/url"
    );
    return response.data.data.authUrl || "";
  },

  /**
   * Handle Google OAuth callback
   * Called after user returns from Google OAuth
   */
  async handleOAuthCallback(
    code: string,
    state: string
  ): Promise<AuthResponse> {
    const response = await apiClient.get<{ data: AuthResponse }>(
      "/api/auth/callback",
      {
        params: { code, state },
      }
    );

    const authData = response.data.data;

    // Store tokens securely
    await SecureStore.setItemAsync("accessToken", authData.accessToken);
    await SecureStore.setItemAsync("refreshToken", authData.refreshToken);
    if (authData.idToken) {
      await SecureStore.setItemAsync("idToken", authData.idToken);
    }

    return authData;
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync("accessToken");
    return !!token;
  },

  /**
   * Get stored access token
   */
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("accessToken");
  },

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync("refreshToken");
  },
};
