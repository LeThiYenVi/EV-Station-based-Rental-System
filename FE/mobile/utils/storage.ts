import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

// ==================== TOKEN STORAGE ====================

export async function setAccessToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
}

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function setTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await Promise.all([
    setAccessToken(accessToken),
    setRefreshToken(refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } else {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }
}

// ==================== USER DATA STORAGE ====================

export async function setUser(user: any): Promise<void> {
  const userData = JSON.stringify(user);
  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, userData);
  } else {
    await SecureStore.setItemAsync(USER_KEY, userData);
  }
}

export async function getUser(): Promise<any | null> {
  try {
    const userData =
      Platform.OS === "web"
        ? localStorage.getItem(USER_KEY)
        : await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

export async function removeUser(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}

export async function clearAllData(): Promise<void> {
  await clearTokens();
  await removeUser();
}

// ==================== LEGACY EXPORT (for backward compatibility) ====================

export const storage = {
  async setToken(token: string): Promise<void> {
    return setAccessToken(token);
  },

  async getToken(): Promise<string | null> {
    return getAccessToken();
  },

  async removeToken(): Promise<void> {
    return clearTokens();
  },

  async setUser(user: any): Promise<void> {
    return setUser(user);
  },

  async getUser(): Promise<any | null> {
    return getUser();
  },

  async removeUser(): Promise<void> {
    return removeUser();
  },
};
