// ==========================================
// useReport Hook
// React hook for report operations
// ==========================================

import { useState, useCallback } from 'react';
import reportService from '../service/report/reportService';
import type {
  RevenueByStationResponse,
  UtilizationResponse,
  PeakHourResponse,
  StaffPerformanceResponse,
  CustomerRiskResponse,
  ReportFilters,
} from '../service/types/report-staff-station.types';

export const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRevenueByStation = useCallback(async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getRevenueByStation(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải báo cáo doanh thu';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUtilization = useCallback(async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getUtilization(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải báo cáo sử dụng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getPeakHours = useCallback(async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getPeakHours(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải báo cáo giờ cao điểm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffPerformance = useCallback(async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getStaffPerformance(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải báo cáo hiệu suất nhân viên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomerRisk = useCallback(async (minBookings: number = 3) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getCustomerRisk(minBookings);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải báo cáo rủi ro khách hàng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getRevenueByStation,
    getUtilization,
    getPeakHours,
    getStaffPerformance,
    getCustomerRisk,
    // Helper methods
    formatCurrency: reportService.formatCurrency,
    formatUtilizationRate: reportService.formatUtilizationRate,
    getUtilizationColor: reportService.getUtilizationColor,
    getRiskLevelText: reportService.getRiskLevelText,
    getRiskLevelColor: reportService.getRiskLevelColor,
    formatPeakHour: reportService.formatPeakHour,
    formatDateRange: reportService.formatDateRange,
    getTopPerformers: reportService.getTopPerformers,
    getHighRiskCustomers: reportService.getHighRiskCustomers,
    getDateRangePresets: reportService.getDateRangePresets,
  };
};
