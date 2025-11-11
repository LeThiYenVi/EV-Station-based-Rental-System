// ==========================================
// Station Service
// Handles station/location management
// ==========================================

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { StationStatus } from '../types/report-staff-station.types';
import type {
  StationResponse,
  StationDetailResponse,
  CreateStationRequest,
  UpdateStationRequest,
  StationFilters,
  AvailableVehiclesCount,
} from '../types/report-staff-station.types';
import type { PageResponse } from '../types/booking.types';

class StationService {
  // ============== CRUD OPERATIONS ==============

  /**
   * Create a new station
   * @param request - Station creation data
   * @returns Created station
   */
  async createStation(request: CreateStationRequest): Promise<StationResponse> {
    const response = await apiClient.post(API_ENDPOINTS.STATIONS.CREATE, request);
    return response.data;
  }

  /**
   * Update station information
   * @param stationId - Station UUID
   * @param request - Updated station data
   * @returns Updated station
   */
  async updateStation(stationId: string, request: UpdateStationRequest): Promise<StationResponse> {
    const url = API_ENDPOINTS.STATIONS.UPDATE.replace(':stationId', stationId);
    const response = await apiClient.put(url, request);
    return response.data;
  }

  /**
   * Get station by ID with full details
   * @param stationId - Station UUID
   * @returns Station detail information
   */
  async getStationById(stationId: string): Promise<StationDetailResponse> {
    const url = API_ENDPOINTS.STATIONS.GET_BY_ID.replace(':stationId', stationId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get all stations with pagination
   * @param filters - Pagination and sorting options
   * @returns Paginated station list
   */
  async getAllStations(filters?: StationFilters): Promise<PageResponse<StationResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

    const response = await apiClient.get(
      `${API_ENDPOINTS.STATIONS.GET_ALL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get all active stations
   * @returns List of active stations
   */
  async getActiveStations(): Promise<StationResponse[]> {
    const response = await apiClient.get(API_ENDPOINTS.STATIONS.GET_ACTIVE);
    return response.data;
  }

  /**
   * Get stations by status
   * @param status - Station status filter
   * @returns List of stations with specified status
   */
  async getStationsByStatus(status: StationStatus): Promise<StationResponse[]> {
    const url = API_ENDPOINTS.STATIONS.GET_BY_STATUS.replace(':status', status);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Delete a station
   * @param stationId - Station UUID
   */
  async deleteStation(stationId: string): Promise<void> {
    const url = API_ENDPOINTS.STATIONS.DELETE.replace(':stationId', stationId);
    await apiClient.delete(url);
  }

  /**
   * Change station status
   * @param stationId - Station UUID
   * @param status - New status
   * @returns Updated station
   */
  async changeStationStatus(stationId: string, status: StationStatus): Promise<StationResponse> {
    const url = API_ENDPOINTS.STATIONS.CHANGE_STATUS.replace(':stationId', stationId);
    const params = new URLSearchParams({ status });
    const response = await apiClient.patch(`${url}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get available vehicles count at a station
   * @param stationId - Station UUID
   * @returns Count of available vehicles
   */
  async getAvailableVehiclesCount(stationId: string): Promise<AvailableVehiclesCount> {
    const url = API_ENDPOINTS.STATIONS.AVAILABLE_VEHICLES_COUNT.replace(':stationId', stationId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Upload station photo
   * @param stationId - Station UUID
   * @param file - Image file
   * @returns Updated station with photo URL
   */
  async uploadStationPhoto(stationId: string, file: File): Promise<StationResponse> {
    const url = API_ENDPOINTS.STATIONS.UPLOAD_PHOTO.replace(':stationId', stationId);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ============== HELPER METHODS ==============

  /**
   * Get station status text in Vietnamese
   */
  getStatusText(status: StationStatus): string {
    const statusTexts: Record<StationStatus, string> = {
      ACTIVE: 'Hoạt động',
      INACTIVE: 'Không hoạt động',
      MAINTENANCE: 'Bảo trì',
      CLOSED: 'Đã đóng cửa',
    };
    return statusTexts[status];
  }

  /**
   * Get station status badge color
   */
  getStatusColor(status: StationStatus): string {
    const colors: Record<StationStatus, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      CLOSED: 'bg-red-100 text-red-800',
    };
    return colors[status];
  }

  /**
   * Check if station is currently open
   */
  isStationOpen(station: StationResponse): boolean {
    if (station.status !== StationStatus.ACTIVE) return false;
    if (!station.openingTime || !station.closingTime) return true;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= station.openingTime && currentTime <= station.closingTime;
  }

  /**
   * Format station address
   */
  formatAddress(station: StationResponse): string {
    const parts = [station.address];
    if (station.ward) parts.push(station.ward);
    if (station.district) parts.push(station.district);
    parts.push(station.city);
    return parts.join(', ');
  }

  /**
   * Calculate utilization percentage
   */
  calculateUtilization(station: StationResponse): number {
    if (station.totalVehicles === 0) return 0;
    const inUse = station.totalVehicles - station.availableVehicles;
    return (inUse / station.totalVehicles) * 100;
  }

  /**
   * Get utilization color based on percentage
   */
  getUtilizationColor(utilizationPercent: number): string {
    if (utilizationPercent >= 80) return 'text-green-600';
    if (utilizationPercent >= 60) return 'text-blue-600';
    if (utilizationPercent >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Filter stations by city
   */
  filterByCity(stations: StationResponse[], city: string): StationResponse[] {
    return stations.filter(s => s.city.toLowerCase().includes(city.toLowerCase()));
  }

  /**
   * Filter stations with available vehicles
   */
  filterWithAvailableVehicles(stations: StationResponse[]): StationResponse[] {
    return stations.filter(s => s.availableVehicles > 0);
  }

  /**
   * Sort stations by available vehicles (descending)
   */
  sortByAvailability(stations: StationResponse[]): StationResponse[] {
    return [...stations].sort((a, b) => b.availableVehicles - a.availableVehicles);
  }

  /**
   * Sort stations by name (alphabetically)
   */
  sortByName(stations: StationResponse[], ascending: boolean = true): StationResponse[] {
    return [...stations].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'vi');
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Search stations by name or address
   */
  searchStations(stations: StationResponse[], query: string): StationResponse[] {
    const lowerQuery = query.toLowerCase();
    return stations.filter(
      s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.address.toLowerCase().includes(lowerQuery) ||
        s.city.toLowerCase().includes(lowerQuery) ||
        (s.district && s.district.toLowerCase().includes(lowerQuery)) ||
        (s.ward && s.ward.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get distance between two coordinates (Haversine formula)
   * Returns distance in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Find nearest stations to a given location
   */
  findNearestStations(
    stations: StationResponse[],
    userLat: number,
    userLon: number,
    limit: number = 5
  ): Array<StationResponse & { distance: number }> {
    const stationsWithDistance = stations
      .filter(s => s.latitude && s.longitude)
      .map(station => ({
        ...station,
        distance: this.calculateDistance(
          userLat,
          userLon,
          station.latitude!,
          station.longitude!
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return stationsWithDistance.slice(0, limit);
  }

  /**
   * Format operating hours
   */
  formatOperatingHours(station: StationResponse): string {
    if (!station.openingTime || !station.closingTime) {
      return '24/7';
    }
    return `${station.openingTime} - ${station.closingTime}`;
  }

  /**
   * Validate station form data
   */
  validateStationData(data: CreateStationRequest | UpdateStationRequest): string[] {
    const errors: string[] = [];

    if ('name' in data && !data.name) {
      errors.push('Tên trạm không được để trống');
    }

    if ('address' in data && !data.address) {
      errors.push('Địa chỉ không được để trống');
    }

    if ('city' in data && !data.city) {
      errors.push('Thành phố không được để trống');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Email không hợp lệ');
    }

    if (data.phoneNumber && !/^[0-9]{10,11}$/.test(data.phoneNumber.replace(/[\s-]/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }

    return errors;
  }

  /**
   * Get popular cities list
   */
  getPopularCities(): string[] {
    return [
      'Hồ Chí Minh',
      'Hà Nội',
      'Đà Nẵng',
      'Cần Thơ',
      'Hải Phòng',
      'Nha Trang',
      'Vũng Tàu',
      'Đà Lạt',
    ];
  }
}

// Export singleton instance
const stationService = new StationService();
export default stationService;
