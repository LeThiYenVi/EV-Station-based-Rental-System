import apiClient from "./apiClient";
import { UserResponse, UpdateUserRequest } from "@/types";

/**
 * User API Service
 * Handles all user-related API calls
 * RENTER/STAFF: Can only access and update own profile
 * ADMIN: Full access (handled via web dashboard)
 */
export const UserApi = {
  /**
   * Get current user's profile (RENTER, STAFF, ADMIN)
   */
  async getMyInfo(): Promise<UserResponse> {
    const response = await apiClient.get<{ data: UserResponse }>(
      "/api/users/me"
    );
    return response.data.data;
  },

  /**
   * Update current user's profile (RENTER, STAFF, ADMIN)
   */
  async updateMyProfile(data: UpdateUserRequest): Promise<UserResponse> {
    // First get user ID
    const currentUser = await this.getMyInfo();

    const response = await apiClient.put<{ data: UserResponse }>(
      `/api/users/${currentUser.id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Upload avatar image (RENTER, STAFF, ADMIN)
   */
  async uploadAvatar(imageUri: string): Promise<UserResponse> {
    // Get current user ID
    const currentUser = await this.getMyInfo();

    // Create form data
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<{ data: UserResponse }>(
      `/api/users/${currentUser.id}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  /**
   * Upload license card image (RENTER, STAFF, ADMIN)
   */
  async uploadLicenseCard(imageUri: string): Promise<UserResponse> {
    // Get current user ID
    const currentUser = await this.getMyInfo();

    // Create form data
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "license.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<{ data: UserResponse }>(
      `/api/users/${currentUser.id}/license-card`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  /**
   * Check if user's license is verified
   */
  isLicenseVerified(user: UserResponse): boolean {
    return user.isLicenseVerified;
  },

  /**
   * Check if user has uploaded license card
   */
  hasLicenseCard(user: UserResponse): boolean {
    return !!user.licenseCardImageUrl;
  },

  /**
   * Check if user profile is complete
   */
  isProfileComplete(user: UserResponse): boolean {
    return !!(
      user.fullName &&
      user.phone &&
      user.email &&
      user.licenseNumber &&
      user.identityNumber &&
      user.licenseCardImageUrl
    );
  },
};
