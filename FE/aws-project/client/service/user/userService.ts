// ==========================================
// User Service
// Handles user management operations
// ==========================================

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type { User, UserResponse } from '../types/auth.types';
import type { PageResponse } from '../types/booking.types';
import type {
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UserRole,
} from '../types/user-vehicle.types';

class UserService {
  // ============== USER OPERATIONS ==============

  /**
   * Get current user information
   * Requires Authorization header with Bearer token
   */
  async getMyInfo(): Promise<UserResponse> {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET_ME);
    return response.data; // apiClient.get() already returns ApiResponse, so just need .data
  }

  /**
   * Get all users with pagination (ADMIN only)
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @param sortBy - Field to sort by
   * @param sortDirection - ASC or DESC
   */
  async getAllUsers(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<PageResponse<UserResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.USERS.GET_ALL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get user by ID (ADMIN/STAFF)
   * @param userId - User UUID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.GET_BY_ID.replace(':userId', userId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get users by role (ADMIN only)
   * @param role - User role to filter by
   */
  async getUsersByRole(role: UserRole): Promise<UserResponse[]> {
    const url = API_ENDPOINTS.USERS.GET_BY_ROLE.replace(':role', role);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Update user information (ADMIN/STAFF)
   * @param userId - User UUID
   * @param request - Updated user data
   */
  async updateUser(userId: string, request: UpdateUserRequest): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.UPDATE.replace(':userId', userId);
    const response = await apiClient.put(url, request);
    return response.data;
  }

  /**
   * Update user role (ADMIN only)
   * @param userId - User UUID
   * @param request - New role and optional station
   */
  async updateUserRole(userId: string, request: UpdateUserRoleRequest): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.UPDATE_ROLE.replace(':userId', userId);
    const response = await apiClient.patch(url, request);
    return response.data;
  }

  /**
   * Verify user's driver license (ADMIN/STAFF)
   * @param userId - User UUID
   */
  async verifyUserLicense(userId: string): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.VERIFY_LICENSE.replace(':userId', userId);
    const response = await apiClient.patch(url);
    return response.data;
  }

  /**
   * Upload user avatar
   * @param userId - User UUID
   * @param file - Image file
   */
  async uploadAvatar(userId: string, file: File): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.UPLOAD_AVATAR.replace(':userId', userId);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Upload user license card
   * @param userId - User UUID
   * @param file - License card image
   */
  async uploadLicenseCard(userId: string, file: File): Promise<UserResponse> {
    const url = API_ENDPOINTS.USERS.UPLOAD_LICENSE_CARD.replace(':userId', userId);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete user (ADMIN only)
   * @param userId - User UUID
   */
  async deleteUser(userId: string): Promise<void> {
    const url = API_ENDPOINTS.USERS.DELETE.replace(':userId', userId);
    await apiClient.delete(url);
  }

  // ============== HELPER METHODS ==============

  /**
   * Get role text in Vietnamese
   */
  getRoleText(role: string): string {
    const roles: Record<string, string> = {
      RENTER: 'Khách hàng',
      STAFF: 'Nhân viên',
      ADMIN: 'Quản trị viên',
      MANAGER: 'Quản lý',
    };
    return roles[role] || role;
  }

  /**
   * Get role badge color
   */
  getRoleBadgeColor(role: string): string {
    const colors: Record<string, string> = {
      RENTER: 'bg-blue-100 text-blue-800',
      STAFF: 'bg-green-100 text-green-800',
      ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-indigo-100 text-indigo-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Check if user has verified license
   */
  hasVerifiedLicense(user: UserResponse): boolean {
    return user.licenseVerified === true;
  }

  /**
   * Check if user has uploaded license card
   */
  hasLicenseCard(user: UserResponse): boolean {
    return !!user.licenseCardUrl;
  }

  /**
   * Check if user can rent vehicles
   */
  canRentVehicles(user: UserResponse): boolean {
    return user.role === 'RENTER' && this.hasVerifiedLicense(user);
  }

  /**
   * Filter users by search query (name, email, phone)
   */
  searchUsers(users: UserResponse[], query: string): UserResponse[] {
    const lowerQuery = query.toLowerCase();
    return users.filter(
      u =>
        u.fullName.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery) ||
        (u.phoneNumber && u.phoneNumber.includes(query))
    );
  }

  /**
   * Sort users by name
   */
  sortByName(users: UserResponse[], ascending: boolean = true): UserResponse[] {
    return [...users].sort((a, b) => {
      const comparison = a.fullName.localeCompare(b.fullName, 'vi');
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Filter users by role
   */
  filterByRole(users: UserResponse[], role: UserRole): UserResponse[] {
    return users.filter(u => u.role === role);
  }

  /**
   * Get users pending license verification
   */
  getPendingVerification(users: UserResponse[]): UserResponse[] {
    return users.filter(u => u.licenseCardUrl && !u.licenseVerified);
  }

  /**
   * Get user statistics
   */
  getUserStats(users: UserResponse[]) {
    return {
      total: users.length,
      byRole: {
        RENTER: users.filter(u => u.role === 'RENTER').length,
        STAFF: users.filter(u => u.role === 'STAFF').length,
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        MANAGER: users.filter(u => u.role === 'MANAGER').length,
      },
      verified: users.filter(u => u.emailVerified).length,
      withLicense: users.filter(u => this.hasVerifiedLicense(u)).length,
      pendingVerification: this.getPendingVerification(users).length,
    };
  }

  /**
   * Validate user update data
   */
  validateUserData(data: UpdateUserRequest): string[] {
    const errors: string[] = [];

    if (data.phoneNumber && !/^[0-9]{10,11}$/.test(data.phoneNumber.replace(/[\s-]/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (data.fullName && data.fullName.length < 2) {
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    }

    if (data.licenseNumber && data.licenseNumber.length < 5) {
      errors.push('Số giấy phép lái xe không hợp lệ');
    }

    return errors;
  }

  /**
   * Format user full info
   */
  formatUserInfo(user: UserResponse): string {
    const parts = [user.fullName];
    if (user.email) parts.push(`(${user.email})`);
    if (user.phoneNumber) parts.push(`- ${user.phoneNumber}`);
    return parts.join(' ');
  }

  /**
   * Check if license is expired
   */
  isLicenseExpired(user: UserResponse): boolean {
    if (!user.licenseExpiryDate) return false;
    return new Date(user.licenseExpiryDate) < new Date();
  }

  /**
   * Get days until license expires
   */
  getDaysUntilExpiry(user: UserResponse): number | null {
    if (!user.licenseExpiryDate) return null;
    
    const expiryDate = new Date(user.licenseExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Format date for display
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;
