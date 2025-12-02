import api from "./api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ConfirmAccountRequest,
} from "@/types";

export const authService = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post("/api/auth/register", data);
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post("/api/auth/login", data);
  },

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout: async (token: string): Promise<void> => {
    return api.post("/api/auth/logout", token);
  },

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken: async (): Promise<AuthResponse> => {
    return api.post("/api/auth/refresh");
  },

  /**
   * Send password reset code to email
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return api.post("/api/auth/forgot-password", data);
  },

  /**
   * Reset password with confirmation code
   * POST /api/auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return api.post("/api/auth/reset-password", data);
  },

  /**
   * Change password (authenticated user)
   * POST /api/auth/change-password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return api.post("/api/auth/change-password", data);
  },

  /**
   * Confirm account with email verification code
   * POST /api/auth/confirm
   */
  confirmAccount: async (data: ConfirmAccountRequest): Promise<void> => {
    return api.post("/api/auth/confirm", data);
  },

  /**
   * Verify OTP code
   * POST /api/auth/verify-otp
   */
  verifyOtp: async (email: string, otp: string): Promise<void> => {
    return api.post("/api/auth/confirm", { email, confirmationCode: otp });
  },

  /**
   * Resend OTP to email
   * POST /api/auth/resend-otp
   */
  resendOtp: async (email: string): Promise<void> => {
    return api.post("/api/auth/resend-otp", { email });
  },

  /**
   * Get Google OAuth authorization URL
   * POST /api/auth/url
   */
  getAuthorizationUrl: async (): Promise<{
    authorizationUrl: string;
    state: string;
  }> => {
    return api.post("/api/auth/url");
  },

  /**
   * Handle Google OAuth callback
   * GET /api/auth/callback
   */
  handleOAuthCallback: async (
    code: string,
    state: string
  ): Promise<AuthResponse> => {
    return api.get("/api/auth/callback", {
      params: { code, state },
    });
  },
};
