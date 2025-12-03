// ==========================================
// useVehicle Hook
// React hook for vehicle operations
// ==========================================

import { useState, useCallback } from "react";
import vehicleService from "../service/vehicle/vehicleService";
import type {
  VehicleResponse,
  VehicleDetailResponse,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleStatus,
  VehicleFilters,
  AvailableVehicleFilters,
} from "../service/types/user-vehicle.types";

export const useVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVehicle = useCallback(async (request: CreateVehicleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.createVehicle(request);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tạo phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(
    async (vehicleId: string, request: UpdateVehicleRequest) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehicleService.updateVehicle(vehicleId, request);
        return { success: true, data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Không thể cập nhật phương tiện";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getVehicleById = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicleById(vehicleId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải thông tin phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllVehicles = useCallback(async (filters?: VehicleFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getAllVehicles(filters);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải danh sách phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getVehiclesByStation = useCallback(async (stationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehiclesByStation(stationId);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải danh sách phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableVehicles = useCallback(
    async (filters: AvailableVehicleFilters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehicleService.getAvailableVehicles(filters);
        return { success: true, data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Không thể tải danh sách phương tiện";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getAvailableForBooking = useCallback(
    async (filters: AvailableVehicleFilters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehicleService.getAvailableForBooking(filters);
        return { success: true, data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Không thể tải danh sách phương tiện";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getVehiclesByStatus = useCallback(async (status: VehicleStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehiclesByStatus(status);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải danh sách phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getVehiclesByBrand = useCallback(async (brand: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehiclesByBrand(brand);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể tải danh sách phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      await vehicleService.deleteVehicle(vehicleId);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Không thể xóa phương tiện";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const changeVehicleStatus = useCallback(
    async (vehicleId: string, status: VehicleStatus) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehicleService.changeVehicleStatus(
          vehicleId,
          status,
        );
        return { success: true, data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Không thể thay đổi trạng thái";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const incrementRentCount = useCallback(async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.incrementRentCount(vehicleId);
      return { success: true, data };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadVehiclePhotos = useCallback(
    async (vehicleId: string, files: File[]) => {
      setLoading(true);
      setError(null);
      try {
        const data = await vehicleService.uploadVehiclePhotos(vehicleId, files);
        return { success: true, data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Không thể tải ảnh lên";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    createVehicle,
    updateVehicle,
    getVehicleById,
    getAllVehicles,
    getVehiclesByStation,
    getAvailableVehicles,
    getAvailableForBooking,
    getVehiclesByStatus,
    getVehiclesByBrand,
    deleteVehicle,
    changeVehicleStatus,
    incrementRentCount,
    uploadVehiclePhotos,
    // Helper methods
    getStatusText: vehicleService.getStatusText,
    getStatusColor: vehicleService.getStatusColor,
    getFuelTypeText: vehicleService.getFuelTypeText,
    getFuelTypeIcon: vehicleService.getFuelTypeIcon,
    formatPricePerHour: vehicleService.formatPricePerHour,
    formatPricePerDay: vehicleService.formatPricePerDay,
    calculateRentalCost: vehicleService.calculateRentalCost,
    isAvailable: vehicleService.isAvailable,
    isElectric: vehicleService.isElectric,
    getVehicleName: vehicleService.getVehicleName,
    filterByPriceRange: vehicleService.filterByPriceRange,
    filterBySeats: vehicleService.filterBySeats,
    sortByPrice: vehicleService.sortByPrice,
    sortByPopularity: vehicleService.sortByPopularity,
    sortByNewest: vehicleService.sortByNewest,
    searchVehicles: vehicleService.searchVehicles,
    getUniqueBrands: vehicleService.getUniqueBrands,
    getUniqueFuelTypes: vehicleService.getUniqueFuelTypes,
    getVehicleStats: vehicleService.getVehicleStats,
    validateVehicleData: vehicleService.validateVehicleData,
    getRecommendedVehicles: vehicleService.getRecommendedVehicles,
    formatMileage: vehicleService.formatMileage,
    getTransmissionText: vehicleService.getTransmissionText,
  };
};
