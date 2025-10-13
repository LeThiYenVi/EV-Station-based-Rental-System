import apiClient from "./apiClient";

export function useAuthApi() {
  const login = async (email: string, password: string) => {
    //const response = await apiClient.post("/login", { email, password });
    if (email === "User" && password === "12345") {
      await new Promise((res) => setTimeout(res, 800));
      return {
        token: "good-token-can-access",
        user: {
          id: 1,
          userName: "Khang",
          role: "user",
        },
      };
    }
  };
  const logout = async () => {
    await apiClient.post("/logout");
  };
  return { login, logout };
}
