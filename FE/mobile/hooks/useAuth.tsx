import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { storage } from "@/utils/storage";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getToken();
      const savedUser = await storage.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        console.log("✅ User loaded from storage:", savedUser.name);
      } else {
        console.log("ℹ️ No saved user found");
      }
    } catch (error) {
      console.error("❌ Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

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
      setUser(userData);

      console.log("✅ Login Success:", userData.name);
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      throw new Error(error.message || "Thông tin đăng nhập không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear local storage
      await storage.removeToken();
      await storage.removeUser();
      setUser(null);

      console.log("✅ Logout Success");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
