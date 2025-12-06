import { apiClient } from "../api/apiClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import {
  RegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyAccountRequest,
  AuthResponse,
  GoogleAuthUrlResponse,
} from "../types/auth.types";

class AuthService {
  /**
   * Register a new user - Step 1: Create user and send OTP to email
   * Backend creates user in "unconfirmed" state and sends OTP code to email
   * Response format: {statusCode: 200, message: "created user!", data: {user: {...}, accessToken: null}}
   */
  async register(data: RegisterRequest): Promise<{ message: string }> {
    console.log("AuthService.register called with data:", {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    });

    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );

    console.log("Register API response:", response);

    // Backend response format: {statusCode: 200, message: "created user!", data: {...}}
    // Return message to show user
    return {
      message:
        response.message ||
        "User created! Please check your email for OTP code.",
    };
  }

  /**
   * Verify OTP after registration - Step 2: Confirm account with OTP
   * Backend returns: {statusCode: 200/201, message: "verified account", data: null}
   * No tokens returned - user must login after verification
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<any> {
    console.log("AuthService.verifyOtp called with:", {
      email: data.email,
      otpCode: data.otpCode,
    });

    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.CONFIRM,
      data,
    );

    console.log("Verify OTP API response:", response);

    // Backend returns: {statusCode: 200/201, message: "verified account", data: null}
    // Return the whole response so we can check statusCode
    return response;
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );

    const authData = response.data!;

    // Store tokens in localStorage
    this.saveTokens(authData);

    // Update login status
    this.updateLoginStatus(true);

    return authData;
  }

  /**
   * Login with Google (handle callback)
   */
  async loginWithGoogle(code: string, state: string): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>(
      `${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}?code=${code}&state=${state}`,
    );

    const authData = response.data!;

    // Store tokens in localStorage
    this.saveTokens(authData);

    // Update login status
    this.updateLoginStatus(true);

    return authData;
  }

  /**
   * Get Google OAuth authorization URL
   */
  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    const response = await apiClient.post<{
      authorizationUrl: string;
      state: string;
    }>(API_ENDPOINTS.AUTH.GOOGLE_URL);

    return response.data!;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, accessToken, {
          headers: { "Content-Type": "text/plain" },
        });
      }
    } finally {
      // Clear tokens regardless of API call success
      this.clearTokens();
      this.updateLoginStatus(false);
    }
  }

  /**
   * Refresh access token using refresh token cookie
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
    );

    const authData = response.data!;

    // Update tokens in localStorage
    this.saveTokens(authData);

    return authData;
  }

  /**
   * Forgot password - send reset code to email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password with code from email
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error("User is not authenticated");
    }

    const data: ChangePasswordRequest = {
      accessToken,
      currentPassword,
      newPassword,
    };

    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  /**
   * Verify account with confirmation code
   */
  async verifyAccount(data: VerifyAccountRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.CONFIRM, data);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem("accessToken");
    const idToken = localStorage.getItem("idToken");
    return !!(accessToken && idToken);
  }

  /**
   * Get current user from stored tokens
   */
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  /**
   * Get ID token
   */
  getIdToken(): string | null {
    return localStorage.getItem("idToken");
  }

  // Private helper methods
  private saveTokens(authData: AuthResponse): void {
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("idToken", authData.idToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
    localStorage.setItem("tokenType", authData.tokenType);
    localStorage.setItem("expiresIn", authData.expiresIn.toString());
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("isLoggedIn");
  }

  private updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new Event("loginStatusChanged"));
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
