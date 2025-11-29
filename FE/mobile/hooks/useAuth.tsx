import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserResponse } from "@/types";
import { authService } from "@/services";
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getUser,
  setUser as saveUser,
  removeUser,
} from "@/utils/storage";
import Toast from "react-native-toast-message";

interface AuthContextType {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      const savedUser = await getUser();

      if (token && savedUser) {
        setUser(savedUser);
        console.log("✅ User loaded from storage:", savedUser.fullName);
      } else {
        console.log("ℹ️ No saved user found");
      }
    } catch (error) {
      console.error("❌ Failed to load user:", error);
      await clearTokens();
      await removeUser();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Call real API
      const response = await authService.login({ email, password });

      // Save tokens
      await setTokens(response.accessToken, response.refreshToken);

      // Save user data
      await saveUser(response.user);
      setUser(response.user);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
        text2: `Chào mừng ${response.user.fullName}!`,
      });

      console.log("✅ Login Success:", response.user.fullName);
    } catch (error: any) {
      console.error("❌ Login Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: errorMessage,
      });

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    try {
      setIsLoading(true);

      // Call real API
      const response = await authService.register({
        email,
        password,
        confirmPassword: password,
        fullName,
        phone,
        role: "RENTER",
      });

      // Save tokens
      await setTokens(response.accessToken, response.refreshToken);

      // Save user data
      await saveUser(response.user);
      setUser(response.user);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công",
        text2: `Chào mừng ${response.user.fullName}!`,
      });

      console.log("✅ Register Success:", response.user.fullName);
    } catch (error: any) {
      console.error("❌ Register Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      Toast.show({
        type: "error",
        text1: "Đăng ký thất bại",
        text2: errorMessage,
      });

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      const token = await getAccessToken();
      if (token) {
        try {
          await authService.logout(token);
        } catch (error) {
          // Ignore logout API errors - still clear local data
          console.log("⚠️ Logout API failed, clearing local data anyway");
        }
      }

      await clearTokens();
      await removeUser();
      setUser(null);

      Toast.show({
        type: "success",
        text1: "Đăng xuất thành công",
      });

      console.log("✅ Logout Success");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      // Force clear anyway
      await clearTokens();
      await removeUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
