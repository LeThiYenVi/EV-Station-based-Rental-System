import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/service";
import type {
  RegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  AuthResponse,
} from "@/service";

interface UseAuthReturn {
  // State
  loading: boolean;
  error: string | null;

  // Methods
  register: (data: RegisterRequest) => Promise<{ message: string } | null>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<AuthResponse | null>;
  login: (data: LoginRequest) => Promise<AuthResponse | null>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<boolean>;
  resetPassword: (data: ResetPasswordRequest) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  verifyAccount: (data: VerifyAccountRequest) => Promise<boolean>;

  // Helpers
  isAuthenticated: () => boolean;
  getCurrentUser: () => any;
  clearError: () => void;
}

/**
 * Custom hook for authentication
 *
 * Usage:
 * ```tsx
 * const { login, logout, loading, error } = useAuth();
 *
 * const handleLogin = async () => {
 *   const result = await login({ email, password });
 *   if (result) {
 *     // Success
 *   }
 * };
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(
    async (data: RegisterRequest): Promise<{ message: string } | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.register(data);

        // Return message, don't navigate - component will show OTP form
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (data: VerifyOtpRequest): Promise<any> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.verifyOtp(data);

        // Return response with statusCode for checking
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Xác thực OTP thất bại";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(
    async (data: LoginRequest): Promise<AuthResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.login(data);

        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Login failed";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { authorizationUrl, state } = await authService.getGoogleAuthUrl();

      // Store state for validation
      sessionStorage.setItem("oauth_state", state);

      // Redirect to Google
      window.location.href = authorizationUrl;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to initiate Google login";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();

      // Navigate to login page
      navigate("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await authService.forgotPassword(data);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to send reset code";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await authService.resetPassword(data);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to reset password";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await authService.changePassword(currentPassword, newPassword);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.errors ||
          "Failed to change password";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const verifyAccount = useCallback(
    async (data: VerifyAccountRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await authService.verifyAccount(data);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to verify account";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  const getCurrentUser = useCallback(() => {
    return authService.getCurrentUser();
  }, []);

  return {
    loading,
    error,
    register,
    verifyOtp,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyAccount,
    isAuthenticated,
    getCurrentUser,
    clearError,
  };
};

export default useAuth;
