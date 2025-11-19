// API Service với switch giữa Mock và Real API
import { ENV_CONFIG, getApiUrl } from "@/config/env";

// Generic API Request Function
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// API Methods
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  // Stations
  getStations: async () => {
    return apiRequest("/stations");
  },

  getStationById: async (id: string) => {
    return apiRequest(`/stations/${id}`);
  },

  // Trips
  getTrips: async () => {
    return apiRequest("/trips");
  },

  // Messages
  getMessages: async () => {
    return apiRequest("/messages");
  },
};
