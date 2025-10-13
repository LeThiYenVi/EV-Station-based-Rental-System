import { useAuthApi } from "@/api/useAuthApi";
import { User } from "@/types/User";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { login: apiLogin, logout: apiLogout } = useAuthApi();

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res) {
      setUser(res.user);
      setToken(res.token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiLogout();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth mus be used within an AuthProvider");
  }
  return context;
};
