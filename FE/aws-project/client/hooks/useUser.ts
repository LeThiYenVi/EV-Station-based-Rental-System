// ==========================================
// useUser Hook
// React hook for user management operations
// ==========================================

import { useState, useCallback } from 'react';
import userService from '../service/user/userService';
import type { UserResponse } from '../service/types/auth.types';
import type {
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UserRole,
} from '../service/types/user-vehicle.types';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMyInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getMyInfo();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getMyStats();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers(page, size, sortBy, sortDirection);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(userId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsersByRole = useCallback(async (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsersByRole(role);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, request: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.updateUser(userId, request);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, request: UpdateUserRoleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.updateUserRole(userId, request);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể thay đổi vai trò';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyUserLicense = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.verifyUserLicense(userId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể xác minh giấy phép';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (userId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.uploadAvatar(userId, file);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải ảnh lên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadLicenseCard = useCallback(async (userId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.uploadLicenseCard(userId, file);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải giấy phép lên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadLicenseCardFront = useCallback(async (userId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.uploadLicenseCardFront(userId, file);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải ảnh mặt trước giấy phép lên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadLicenseCardBack = useCallback(async (userId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.uploadLicenseCardBack(userId, file);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải ảnh mặt sau giấy phép lên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể xóa người dùng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMyInfo,
    getMyStats,
    getAllUsers,
    getUserById,
    getUsersByRole,
    updateUser,
    updateUserRole,
    verifyUserLicense,
    uploadAvatar,
    uploadLicenseCard,
    uploadLicenseCardFront,
    uploadLicenseCardBack,
    deleteUser,
    // Helper methods
    getRoleText: userService.getRoleText,
    getRoleBadgeColor: userService.getRoleBadgeColor,
    hasVerifiedLicense: userService.hasVerifiedLicense,
    hasLicenseCard: userService.hasLicenseCard,
    canRentVehicles: userService.canRentVehicles,
    searchUsers: userService.searchUsers,
    sortByName: userService.sortByName,
    filterByRole: userService.filterByRole,
    getPendingVerification: userService.getPendingVerification,
    getUserStats: userService.getUserStats,
    validateUserData: userService.validateUserData,
    formatUserInfo: userService.formatUserInfo,
    isLicenseExpired: userService.isLicenseExpired,
    getDaysUntilExpiry: userService.getDaysUntilExpiry,
    formatDate: userService.formatDate,
  };
};
