// API Service với switch giữa Mock và Real API
import { ENV_CONFIG, getApiUrl } from "@/config/env";

// Backend API Response Types
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  cognitoSub?: string;
  avatarUrl?: string;
  role: string;
  licenseNumber?: string;
  identityNumber?: string;
  licenseCardFrontImageUrl?: string;
  licenseCardBackImageUrl?: string;
  isLicenseVerified: boolean;
  verifiedAt?: string;
  stationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Generic API Request Function
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const jsonData = await response.json();

    if (!response.ok) {
      // Backend returns error in ApiResponse format
      throw new Error(jsonData.message || `API Error: ${response.status}`);
    }

    return jsonData;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// API Methods
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        fullName,
        phone,
        password,
        confirmPassword: password,
        role: "RENTER",
      }),
    });
  },

  confirmAccount: async (email: string, otpCode: string) => {
    return apiRequest<void>("/auth/confirm", {
      method: "POST",
      body: JSON.stringify({ email, otpCode }),
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
