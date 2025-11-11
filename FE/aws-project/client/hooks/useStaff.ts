// ==========================================
// useStaff Hook
// React hook for staff operations
// ==========================================

import { useState, useCallback } from 'react';
import staffService from '../service/staff/staffService';
import type { UserResponse } from '../service/types/auth.types';

export const useStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStaffByStation = useCallback(async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getStaffByStation(stationId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách nhân viên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getStaffByStation,
    // Helper methods
    getRoleText: staffService.getRoleText,
    getRoleBadgeColor: staffService.getRoleBadgeColor,
    filterByRole: staffService.filterByRole,
    filterActiveStaff: staffService.filterActiveStaff,
    getStaffCountByRole: staffService.getStaffCountByRole,
    formatStaffName: staffService.formatStaffName,
    isStaffActive: staffService.isStaffActive,
    sortByName: staffService.sortByName,
    searchStaff: staffService.searchStaff,
  };
};
