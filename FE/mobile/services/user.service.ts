import api from "./api";
import { UserResponse, UpdateUserRequest } from "@/types";

export const userService = {
  /**
   * Get current user info
   * GET /api/users/me
   */
  getMyInfo: async (): Promise<UserResponse> => {
    return api.get("/api/users/me");
  },

  /**
   * Update user profile
   * PUT /api/users/{userId}
   */
  updateUser: async (
    userId: string,
    data: UpdateUserRequest
  ): Promise<UserResponse> => {
    return api.put(`/api/users/${userId}`, data);
  },

  /**
   * Upload user avatar
   * POST /api/users/{userId}/avatar
   */
  uploadAvatar: async (
    userId: string,
    file: File | Blob
  ): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/api/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Upload license card front image
   * POST /api/users/{userId}/license-card/front
   */
  uploadLicenseFront: async (
    userId: string,
    file: File | Blob
  ): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/api/users/${userId}/license-card/front`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Upload license card back image
   * POST /api/users/{userId}/license-card/back
   */
  uploadLicenseBack: async (
    userId: string,
    file: File | Blob
  ): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/api/users/${userId}/license-card/back`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Get user by ID (admin/staff only)
   * GET /api/users/{userId}
   */
  getUserById: async (userId: string): Promise<UserResponse> => {
    return api.get(`/api/users/${userId}`);
  },

  /**
   * Delete user (admin only)
   * DELETE /api/users/{userId}
   */
  deleteUser: async (userId: string): Promise<void> => {
    return api.delete(`/api/users/${userId}`);
  },
};
