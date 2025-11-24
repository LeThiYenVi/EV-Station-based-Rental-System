// ==========================================
// useStation Hook
// React hook for station operations
// ==========================================

import { useState, useCallback } from 'react';
import stationService from '../service/station/stationService';
import type {
  StationResponse,
  StationDetailResponse,
  CreateStationRequest,
  UpdateStationRequest,
  StationStatus,
  StationFilters,
} from '../service/types/report-staff-station.types';

export const useStation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStation = useCallback(async (request: CreateStationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.createStation(request);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tạo trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStation = useCallback(async (stationId: string, request: UpdateStationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.updateStation(stationId, request);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStationById = useCallback(async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.getStationById(stationId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllStations = useCallback(async (filters?: StationFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.getAllStations(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.getActiveStations();
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách trạm hoạt động';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStationsByStatus = useCallback(async (status: StationStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.getStationsByStatus(status);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStation = useCallback(async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await stationService.deleteStation(stationId);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể xóa trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStationStatus = useCallback(async (stationId: string, status: StationStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.changeStationStatus(stationId, status);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể thay đổi trạng thái trạm';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableVehiclesCount = useCallback(async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.getAvailableVehiclesCount(stationId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải số lượng xe khả dụng';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadStationPhoto = useCallback(async (stationId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await stationService.uploadStationPhoto(stationId, file);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải ảnh lên';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createStation,
    updateStation,
    getStationById,
    getAllStations,
    getActiveStations,
    getStationsByStatus,
    deleteStation,
    changeStationStatus,
    getAvailableVehiclesCount,
    uploadStationPhoto,
    // Helper methods
    getStatusText: stationService.getStatusText,
    getStatusColor: stationService.getStatusColor,
    isStationOpen: stationService.isStationOpen,
    formatAddress: stationService.formatAddress,
    calculateUtilization: stationService.calculateUtilization,
    getUtilizationColor: stationService.getUtilizationColor,
    filterByCity: stationService.filterByCity,
    filterWithAvailableVehicles: stationService.filterWithAvailableVehicles,
    sortByAvailability: stationService.sortByAvailability,
    sortByName: stationService.sortByName,
    searchStations: stationService.searchStations,
    calculateDistance: stationService.calculateDistance,
    findNearestStations: stationService.findNearestStations,
    formatOperatingHours: stationService.formatOperatingHours,
    validateStationData: stationService.validateStationData,
    getPopularCities: stationService.getPopularCities,
  };
};
