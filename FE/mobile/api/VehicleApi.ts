import apiClient from "./apiClient";
import {
  VehicleResponse,
  VehicleDetailResponse,
  VehicleFilterParams,
  VehicleStatus,
  FuelType,
  Page,
  PaginationParams,
} from "@/types";

/**
 * Vehicle API Service
 * Handles all vehicle-related API calls for RENTER role
 * Note: Create, Update, Delete operations are STAFF/ADMIN only (not included)
 */
export const VehicleApi = {
  /**
   * Get all vehicles with pagination
   * PUBLIC - No auth required
   */
  async getAllVehicles(
    params?: PaginationParams
  ): Promise<Page<VehicleResponse>> {
    const response = await apiClient.get<{ data: Page<VehicleResponse> }>(
      "/api/vehicles",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get vehicle by ID
   * PUBLIC - No auth required
   */
  async getVehicleById(vehicleId: string): Promise<VehicleDetailResponse> {
    const response = await apiClient.get<{ data: VehicleDetailResponse }>(
      `/api/vehicles/${vehicleId}`
    );
    return response.data.data;
  },

  /**
   * Get vehicles by station
   * PUBLIC - No auth required
   */
  async getVehiclesByStation(stationId: string): Promise<VehicleResponse[]> {
    const response = await apiClient.get<{ data: VehicleResponse[] }>(
      `/api/vehicles/station/${stationId}`
    );
    return response.data.data;
  },

  /**
   * Get available vehicles (basic availability)
   * PUBLIC - No auth required
   */
  async getAvailableVehicles(params: {
    stationId: string;
    fuelType?: FuelType;
    brand?: string;
  }): Promise<VehicleResponse[]> {
    const response = await apiClient.get<{ data: VehicleResponse[] }>(
      "/api/vehicles/available",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get available vehicles for booking within time range
   * PUBLIC - No auth required
   * This checks real availability based on existing bookings
   */
  async getAvailableVehiclesForBooking(params: {
    stationId: string;
    startTime: string; // ISO datetime string
    endTime: string; // ISO datetime string
    fuelType?: FuelType;
  }): Promise<VehicleResponse[]> {
    const response = await apiClient.get<{ data: VehicleResponse[] }>(
      "/api/vehicles/available/booking",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get vehicles by status
   * PUBLIC - No auth required
   */
  async getVehiclesByStatus(status: VehicleStatus): Promise<VehicleResponse[]> {
    const response = await apiClient.get<{ data: VehicleResponse[] }>(
      `/api/vehicles/status/${status}`
    );
    return response.data.data;
  },

  /**
   * Get vehicles by brand
   * PUBLIC - No auth required
   */
  async getVehiclesByBrand(brand: string): Promise<VehicleResponse[]> {
    const response = await apiClient.get<{ data: VehicleResponse[] }>(
      `/api/vehicles/brand/${brand}`
    );
    return response.data.data;
  },

  /**
   * Search and filter vehicles with advanced options
   * Client-side filtering with multiple criteria
   */
  async filterVehicles(
    filters: VehicleFilterParams
  ): Promise<VehicleResponse[]> {
    let vehicles: VehicleResponse[];

    // If time range is specified, use booking availability endpoint
    if (filters.startTime && filters.endTime && filters.stationId) {
      vehicles = await this.getAvailableVehiclesForBooking({
        stationId: filters.stationId,
        startTime: filters.startTime,
        endTime: filters.endTime,
        fuelType: filters.fuelType,
      });
    }
    // If only station is specified
    else if (filters.stationId) {
      vehicles = await this.getVehiclesByStation(filters.stationId);
    }
    // Otherwise get all vehicles (paginated)
    else {
      const page = await this.getAllVehicles({
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      });
      vehicles = page.content;
    }

    // Apply client-side filters
    let filtered = vehicles;

    if (filters.fuelType) {
      filtered = filtered.filter((v) => v.fuelType === filters.fuelType);
    }

    if (filters.brand) {
      filtered = filtered.filter((v) =>
        v.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    if (filters.minCapacity) {
      filtered = filtered.filter((v) => v.capacity >= filters.minCapacity!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (v) =>
          v.hourlyRate <= filters.maxPrice! || v.dailyRate <= filters.maxPrice!
      );
    }

    return filtered;
  },

  /**
   * Get popular vehicles (sorted by rent count)
   */
  async getPopularVehicles(limit: number = 10): Promise<VehicleResponse[]> {
    const params: PaginationParams = {
      page: 0,
      size: limit,
      sortBy: "rentCount",
      sortDirection: "DESC",
    };

    const page = await this.getAllVehicles(params);
    return page.content;
  },

  /**
   * Get top rated vehicles
   */
  async getTopRatedVehicles(limit: number = 10): Promise<VehicleResponse[]> {
    const params: PaginationParams = {
      page: 0,
      size: limit,
      sortBy: "rating",
      sortDirection: "DESC",
    };

    const page = await this.getAllVehicles(params);
    return page.content;
  },

  /**
   * Search vehicles by name or license plate
   */
  async searchVehicles(
    query: string,
    stationId?: string
  ): Promise<VehicleResponse[]> {
    let vehicles: VehicleResponse[];

    if (stationId) {
      vehicles = await this.getVehiclesByStation(stationId);
    } else {
      const page = await this.getAllVehicles({ size: 100 });
      vehicles = page.content;
    }

    const lowerQuery = query.toLowerCase();
    return vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(lowerQuery) ||
        vehicle.licensePlate.toLowerCase().includes(lowerQuery) ||
        vehicle.brand.toLowerCase().includes(lowerQuery)
    );
  },
};
