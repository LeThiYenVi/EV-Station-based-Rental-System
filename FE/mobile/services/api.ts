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
    const method = options?.method || "GET";

    console.log("API Request:", { method, url, headers: options?.headers });

    const isFormData = options?.body instanceof FormData;

    const response = await fetch(url, {
      method,
      headers: isFormData
        ? options?.headers // Don't set Content-Type for FormData
        : {
            "Content-Type": "application/json",
            ...options?.headers,
          },
      body: options?.body,
    });

    // Check response status first
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const jsonData = await response.json();
        // Backend returns error in ApiResponse format
        errorMessage = jsonData.errors
          ? typeof jsonData.errors === "string"
            ? jsonData.errors
            : jsonData.message
          : jsonData.message || errorMessage;
      } catch (parseError) {
        // Response is not JSON (e.g., 401 with empty body)
        console.log("⚠️ Non-JSON error response");
      }

      throw new Error(errorMessage);
    }

    // Parse successful response
    const jsonData = await response.json();

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

  // Vehicles
  getVehicleById: async (id: string) => {
    return apiRequest(`/vehicles/${id}`);
  },

  getVehiclesByStation: async (stationId: string) => {
    return apiRequest(`/vehicles/station/${stationId}`);
  },

  getAvailableVehicles: async (
    stationId: string,
    startTime: string,
    endTime: string
  ) => {
    const params = new URLSearchParams({
      stationId,
      startTime,
      endTime,
    });
    return apiRequest(`/vehicles/available/booking?${params}`);
  },

  // Bookings
  createBooking: async (
    vehicleId: string,
    startTime: string,
    expectedEndTime: string,
    pickupNote?: string,
    token?: string,
    stationId?: string
  ) => {
    return apiRequest("/bookings", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({
        vehicleId,
        stationId,
        startTime,
        expectedEndTime,
        pickupNote,
      }),
    });
  },

  getMyBookings: async (token: string) => {
    return apiRequest("/bookings/my-bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getBookingById: async (bookingId: string, token: string) => {
    return apiRequest(`/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  cancelBooking: async (bookingId: string, token: string) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Users / Profile
  getMyInfo: async (token: string) => {
    return apiRequest("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateUser: async (userId: string, data: any, token: string) => {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  uploadAvatar: async (userId: string, file: File | Blob, token: string) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest(`/users/${userId}/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData as any,
    });
  },

  uploadLicenseFront: async (
    userId: string,
    file: File | Blob,
    token: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest(`/users/${userId}/license-card/front`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData as any,
    });
  },

  uploadLicenseBack: async (
    userId: string,
    file: File | Blob,
    token: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest(`/users/${userId}/license-card/back`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData as any,
    });
  },
};
