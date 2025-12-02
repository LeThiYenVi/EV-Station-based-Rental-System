import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
<<<<<<< HEAD
import { User } from "@/types";
import { storage } from "@/utils/storage";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
<<<<<<< HEAD
    name: string,
    phone?: string
  ) => Promise<void>;
  verifyOTP: (
    email: string,
    otp: string,
    name: string,
    password: string
  ) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
=======
    fullName: string,
    phone: string
  ) => Promise<void>;
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
=======
  const [user, setUser] = useState<UserResponse | null>(null);
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
<<<<<<< HEAD
      const savedToken = await storage.getToken();
      const savedUser = await storage.getUser();
=======
      const token = await getAccessToken();
      const savedUser = await getUser();
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5

      if (savedToken && savedUser) {
        setToken(savedToken);
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

<<<<<<< HEAD
      // Validation
      if (!email || !password) {
        throw new Error("Email và mật khẩu không được để trống");
      }

      // Call real API
      const response = await api.login(email, password);

      // Map backend UserResponse to our User type
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.fullName,
        phone: response.data.user.phone,
        avatar: response.data.user.avatarUrl,
        role: response.data.user.role,
        isLicenseVerified: response.data.user.isLicenseVerified,
      };

      // Save token and user
      await storage.setToken(response.data.accessToken);
      await storage.setUser(userData);
      setToken(response.data.accessToken);
      setUser(userData);

      console.log("✅ Login Success:", userData.name);
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      throw new Error(error.message || "Thông tin đăng nhập không đúng");
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
<<<<<<< HEAD
    name: string,
    phone?: string
=======
    fullName: string,
    phone: string
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  ) => {
    try {
      setIsLoading(true);

<<<<<<< HEAD
      // Validation
      if (!email || !password || !name) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      if (password.length < 8) {
        throw new Error("Mật khẩu phải có ít nhất 8 ký tự");
      }

      // Call real API - Register will send OTP to email
      const response = await api.register(email, password, name, phone || "");
      console.log("📧 Registration initiated. OTP sent to:", email);
      console.log("📬 Check your email for the confirmation code");
    } catch (error: any) {
      console.error("❌ Register Error:", error);
      throw new Error(error.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string,
    name: string,
    password: string
  ) => {
    try {
      setIsLoading(true);

      // Validate OTP format
      if (otp.length !== 6) {
        throw new Error("Mã OTP phải có 6 chữ số");
      }

      // Step 1: Confirm account with OTP
      await api.confirmAccount(email, otp);
      console.log("✅ Account confirmed successfully");

      // Step 2: Auto login after confirmation
      const loginResponse = await api.login(email, password);

      // Map backend UserResponse to our User type
      const userData: User = {
        id: loginResponse.data.user.id,
        email: loginResponse.data.user.email,
        name: loginResponse.data.user.fullName,
        phone: loginResponse.data.user.phone,
        avatar: loginResponse.data.user.avatarUrl,
        role: loginResponse.data.user.role,
        isLicenseVerified: loginResponse.data.user.isLicenseVerified,
      };

      // Save token and user
      await storage.setToken(loginResponse.data.accessToken);
      await storage.setUser(userData);
      setToken(loginResponse.data.accessToken);
      setUser(userData);

      console.log("✅ Login Success after OTP verification:", userData.name);
    } catch (error: any) {
      console.error("❌ OTP Verify Error:", error);
      throw new Error(error.message || "Mã OTP không đúng hoặc đã hết hạn");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      setIsLoading(true);

      // Note: Backend doesn't have dedicated resend endpoint
      // We need to call forgot-password or register again
      // For now, throwing error to tell user to wait
      throw new Error(
        "Chức năng gửi lại OTP đang được phát triển. Vui lòng kiểm tra email của bạn."
      );
    } catch (error: any) {
      console.error("❌ Resend OTP Error:", error);
      throw new Error(error.message || "Không thể gửi lại OTP");
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

<<<<<<< HEAD
      // Clear local storage
      await storage.removeToken();
      await storage.removeUser();
      setToken(null);
      setUser(null);

=======
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

>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
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
<<<<<<< HEAD
        token,
=======
        setUser,
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
        isLoading,
        login,
        register,
        verifyOTP,
        resendOTP,
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
