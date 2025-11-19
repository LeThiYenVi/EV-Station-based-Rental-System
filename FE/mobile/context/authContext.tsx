import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { AuthApi } from "@/api/AuthApi";
import { UserApi } from "@/api/UserApi";
import { UserResponse, LoginRequest, RegisterRequest } from "@/types";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user and token on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * Load authentication state from secure storage
   */
  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = await SecureStore.getItemAsync("accessToken");

      if (storedToken) {
        setToken(storedToken);
        // Fetch user info
        const userInfo = await UserApi.getMyInfo();
        setUser(userInfo);
      }
    } catch (err) {
      console.error("Error loading stored auth:", err);
      // Clear invalid tokens
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const loginData: LoginRequest = { email, password };
      const authResponse = await AuthApi.login(loginData);

      setToken(authResponse.accessToken);
      setUser(authResponse.user);
    } catch (err: any) {
      const errorMessage =
        err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      await AuthApi.register(data);
      // Don't auto-login, user needs to verify email first
    } catch (err: any) {
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthApi.logout();
      await clearAuth();
    } catch (err) {
      console.error("Logout error:", err);
      // Clear local state even if API call fails
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user information
   */
  const refreshUser = async () => {
    try {
      if (token) {
        const userInfo = await UserApi.getMyInfo();
        setUser(userInfo);
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
      throw err;
    }
  };

  /**
   * Clear authentication state
   */
  const clearAuth = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("idToken");
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
