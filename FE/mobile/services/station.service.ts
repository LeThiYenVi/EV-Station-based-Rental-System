import api from "./api";
import {
  StationResponse,
  StationDetailResponse,
  NearbyStationsPageResponse,
  NearbyStationSearchRequest,
  Page,
} from "@/types";

export const stationService = {
  /**
   * Get all stations (paginated)
   * GET /api/stations
   */
  getAllStations: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<Page<StationResponse>> => {
    return api.get("/api/stations", { params });
  },

  /**
   * Get station by ID
   * GET /api/stations/{stationId}
   */
  getStationById: async (stationId: string): Promise<StationDetailResponse> => {
    return api.get(`/api/stations/${stationId}`);
  },

  /**
   * Get active stations only
   * GET /api/stations/active
   */
  getActiveStations: async (): Promise<StationResponse[]> => {
    return api.get("/api/stations/active");
  },

  /**
   * Get available vehicles count for a station
   * GET /api/stations/{stationId}/vehicles/available/count
   */
  getAvailableVehicleCount: async (
    stationId: string
  ): Promise<{ availableVehicles: number }> => {
    return api.get(`/api/stations/${stationId}/vehicles/available/count`);
  },

  /**
   * Find nearby stations based on user location
   * GET /api/locations/stations/nearby
   */
  findNearbyStations: async (
    searchParams: NearbyStationSearchRequest
  ): Promise<NearbyStationsPageResponse> => {
    return api.get("/api/locations/stations/nearby", {
      params: searchParams,
    });
  },

  /**
   * Get stations by status
   * GET /api/stations/status/{status}
   */
  getStationsByStatus: async (
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE"
  ): Promise<StationResponse[]> => {
    return api.get(`/api/stations/status/${status}`);
  },
};
