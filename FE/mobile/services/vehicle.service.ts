import api from "./api";
import { VehicleResponse, VehicleDetailResponse, Page } from "@/types";

export const vehicleService = {
  /**
   * Get all vehicles (paginated)
   * GET /api/vehicles
   */
  getAllVehicles: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<Page<VehicleResponse>> => {
    return api.get("/api/vehicles", { params });
  },

  /**
   * Get vehicle by ID
   * GET /api/vehicles/{vehicleId}
   */
  getVehicleById: async (vehicleId: string): Promise<VehicleDetailResponse> => {
    return api.get(`/api/vehicles/${vehicleId}`);
  },

  /**
   * Get vehicles by station ID
   * GET /api/vehicles/station/{stationId}
   */
  getVehiclesByStation: async (
    stationId: string
  ): Promise<VehicleResponse[]> => {
    return api.get(`/api/vehicles/station/${stationId}`);
  },

  /**
   * Get available vehicles with optional filters
   * GET /api/vehicles/available
   */
  getAvailableVehicles: async (params?: {
    stationId?: string;
    fuelType?: string;
    brand?: string;
  }): Promise<VehicleResponse[]> => {
    return api.get("/api/vehicles/available", { params });
  },

  /**
   * Get vehicles available for booking in time range
   * GET /api/vehicles/available/booking
   */
  getAvailableVehiclesForBooking: async (params: {
    stationId?: string;
    fuelType?: string;
    startTime: string; // ISO DateTime
    endTime: string; // ISO DateTime
  }): Promise<VehicleResponse[]> => {
    return api.get("/api/vehicles/available/booking", { params });
  },

  /**
   * Get vehicles by status
   * GET /api/vehicles/status/{status}
   */
  getVehiclesByStatus: async (
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "INACTIVE"
  ): Promise<VehicleResponse[]> => {
    return api.get(`/api/vehicles/status/${status}`);
  },

  /**
   * Get vehicles by brand
   * GET /api/vehicles/brand/{brand}
   */
  getVehiclesByBrand: async (brand: string): Promise<VehicleResponse[]> => {
    return api.get(`/api/vehicles/brand/${brand}`);
  },
};
