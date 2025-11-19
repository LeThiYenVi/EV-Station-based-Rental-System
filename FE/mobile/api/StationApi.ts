import apiClient from "./apiClient";
import {
  StationResponse,
  StationDetailResponse,
  NearbyStationsPageResponse,
  NearbyStationSearchRequest,
  StationStatus,
  Page,
  PaginationParams,
} from "@/types";

/**
 * Station API Service
 * Handles all station-related API calls
 * Note: Create, Update, Delete operations are ADMIN only (not included in mobile app)
 */
export const StationApi = {
  /**
   * Get all stations with pagination
   * PUBLIC - No auth required
   */
  async getAllStations(
    params?: PaginationParams
  ): Promise<Page<StationResponse>> {
    const response = await apiClient.get<{ data: Page<StationResponse> }>(
      "/api/stations",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get station by ID
   * PUBLIC - No auth required
   */
  async getStationById(stationId: string): Promise<StationDetailResponse> {
    const response = await apiClient.get<{ data: StationDetailResponse }>(
      `/api/stations/${stationId}`
    );
    return response.data.data;
  },

  /**
   * Get station detail (same as getStationById)
   * PUBLIC - No auth required
   */
  async getStationDetail(stationId: string): Promise<StationDetailResponse> {
    return this.getStationById(stationId);
  },

  /**
   * Get all active stations
   * PUBLIC - No auth required
   */
  async getActiveStations(): Promise<StationResponse[]> {
    const response = await apiClient.get<{ data: StationResponse[] }>(
      "/api/stations/active"
    );
    return response.data.data;
  },

  /**
   * Get stations by status
   * PUBLIC - No auth required
   */
  async getStationsByStatus(status: StationStatus): Promise<StationResponse[]> {
    const response = await apiClient.get<{ data: StationResponse[] }>(
      `/api/stations/status/${status}`
    );
    return response.data.data;
  },

  /**
   * Find nearby stations based on user location
   * PUBLIC - No auth required
   */
  async getNearbyStations(
    searchParams: NearbyStationSearchRequest
  ): Promise<NearbyStationsPageResponse> {
    const response = await apiClient.get<{ data: NearbyStationsPageResponse }>(
      "/api/locations/stations/nearby",
      { params: searchParams }
    );
    return response.data.data;
  },

  /**
   * Get available vehicles count for a station
   * PUBLIC - No auth required
   */
  async getAvailableVehiclesCount(
    stationId: string
  ): Promise<Record<string, number>> {
    const response = await apiClient.get<{ data: Record<string, number> }>(
      `/api/stations/${stationId}/vehicles/available/count`
    );
    return response.data.data;
  },

  /**
   * Search stations by name or address
   * Client-side filtering of all stations
   */
  async searchStations(query: string): Promise<StationResponse[]> {
    const allStations = await this.getActiveStations();
    const lowerQuery = query.toLowerCase();

    return allStations.filter(
      (station) =>
        station.name.toLowerCase().includes(lowerQuery) ||
        station.address.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get stations sorted by rating
   */
  async getTopRatedStations(limit: number = 10): Promise<StationResponse[]> {
    const params: PaginationParams = {
      page: 0,
      size: limit,
      sortBy: "rating",
      sortDirection: "DESC",
    };

    const page = await this.getAllStations(params);
    return page.content;
  },
};
