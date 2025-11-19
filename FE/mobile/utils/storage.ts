import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const storage = {
  async setToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  async setUser(user: any): Promise<void> {
    const userData = JSON.stringify(user);
    if (Platform.OS === "web") {
      localStorage.setItem(USER_KEY, userData);
    } else {
      await SecureStore.setItemAsync(USER_KEY, userData);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userData =
        Platform.OS === "web"
          ? localStorage.getItem(USER_KEY)
          : await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  async removeUser(): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  },
};
