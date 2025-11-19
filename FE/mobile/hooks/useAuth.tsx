import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { storage } from "@/utils/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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

      // Mock delay để giả lập network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password) {
        throw new Error("Email và mật khẩu không được để trống");
      }

      // Mock user data - Tạo tên từ email
      const userName =
        email.split("@")[0].charAt(0).toUpperCase() +
        email.split("@")[0].slice(1);

      const mockUser: User = {
        id: "mock_" + Date.now(),
        email,
        name: userName,
        phone: "+84 123 456 789",
        avatar: undefined,
      };

      const mockToken = "mock_token_" + Date.now();

      await storage.setToken(mockToken);
      await storage.setUser(mockUser);
      setUser(mockUser);

      console.log("✅ Mock Login Success:", mockUser.name);
    } catch (error) {
      console.error("❌ Mock Login Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);

      // Mock delay để giả lập network request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock validation
      if (!email || !password || !name) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      if (password.length < 6) {
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      }

      // Mock user data
      const mockUser: User = {
        id: "mock_" + Date.now(),
        email,
        name,
        phone: undefined,
        avatar: undefined,
      };

      const mockToken = "mock_token_" + Date.now();

      await storage.setToken(mockToken);
      await storage.setUser(mockUser);
      setUser(mockUser);

      console.log("✅ Mock Register Success:", mockUser.name);
    } catch (error) {
      console.error("❌ Mock Register Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      await storage.removeToken();
      await storage.removeUser();
      setUser(null);

      console.log("✅ Mock Logout Success");
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
