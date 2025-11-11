// ==========================================
// Vehicle Service  
// Handles vehicle management and browsing
// ==========================================

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type { PageResponse } from '../types/booking.types';
import {
  VehicleStatus,
  FuelType,
} from '../types/user-vehicle.types';
import type {
  VehicleResponse,
  VehicleDetailResponse,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleFilters,
  AvailableVehicleFilters,
} from '../types/user-vehicle.types';

class VehicleService {
  // ============== CRUD OPERATIONS ==============

  /**
   * Create a new vehicle (ADMIN/STAFF)
   * @param request - Vehicle creation data
   */
  async createVehicle(request: CreateVehicleRequest): Promise<VehicleResponse> {
    const response = await apiClient.post(API_ENDPOINTS.VEHICLES.CREATE, request);
    return response.data;
  }

  /**
   * Update vehicle information (ADMIN/STAFF)
   * @param vehicleId - Vehicle UUID
   * @param request - Updated vehicle data
   */
  async updateVehicle(vehicleId: string, request: UpdateVehicleRequest): Promise<VehicleResponse> {
    const url = API_ENDPOINTS.VEHICLES.UPDATE.replace(':vehicleId', vehicleId);
    const response = await apiClient.put(url, request);
    return response.data;
  }

  /**
   * Get vehicle detail by ID
   * @param vehicleId - Vehicle UUID
   */
  async getVehicleById(vehicleId: string): Promise<VehicleDetailResponse> {
    const url = API_ENDPOINTS.VEHICLES.GET_BY_ID.replace(':vehicleId', vehicleId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get all vehicles with pagination
   * @param filters - Pagination and sorting options
   */
  async getAllVehicles(filters?: VehicleFilters): Promise<PageResponse<VehicleResponse>> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

    const response = await apiClient.get(
      `${API_ENDPOINTS.VEHICLES.GET_ALL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get vehicles by station ID
   * @param stationId - Station UUID
   */
  async getVehiclesByStation(stationId: string): Promise<VehicleResponse[]> {
    const url = API_ENDPOINTS.VEHICLES.GET_BY_STATION.replace(':stationId', stationId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get available vehicles
   * @param filters - Station, fuel type, brand filters
   */
  async getAvailableVehicles(filters: AvailableVehicleFilters): Promise<VehicleResponse[]> {
    const params = new URLSearchParams({
      stationId: filters.stationId,
    });
    
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.brand) params.append('brand', filters.brand);

    const response = await apiClient.get(
      `${API_ENDPOINTS.VEHICLES.GET_AVAILABLE}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get truly available vehicles for booking (considering time slots)
   * @param filters - Station, time range, fuel type filters
   */
  async getAvailableForBooking(filters: AvailableVehicleFilters): Promise<VehicleResponse[]> {
    if (!filters.startTime || !filters.endTime) {
      throw new Error('Start time and end time are required');
    }

    const params = new URLSearchParams({
      stationId: filters.stationId,
      startTime: filters.startTime.toISOString(),
      endTime: filters.endTime.toISOString(),
    });
    
    if (filters.fuelType) params.append('fuelType', filters.fuelType);

    const response = await apiClient.get(
      `${API_ENDPOINTS.VEHICLES.GET_AVAILABLE_FOR_BOOKING}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get vehicles by status
   * @param status - Vehicle status
   */
  async getVehiclesByStatus(status: VehicleStatus): Promise<VehicleResponse[]> {
    const url = API_ENDPOINTS.VEHICLES.GET_BY_STATUS.replace(':status', status);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get vehicles by brand
   * @param brand - Vehicle brand
   */
  async getVehiclesByBrand(brand: string): Promise<VehicleResponse[]> {
    const url = API_ENDPOINTS.VEHICLES.GET_BY_BRAND.replace(':brand', encodeURIComponent(brand));
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Delete vehicle (ADMIN only)
   * @param vehicleId - Vehicle UUID
   */
  async deleteVehicle(vehicleId: string): Promise<void> {
    const url = API_ENDPOINTS.VEHICLES.DELETE.replace(':vehicleId', vehicleId);
    await apiClient.delete(url);
  }

  /**
   * Change vehicle status (ADMIN/STAFF)
   * @param vehicleId - Vehicle UUID
   * @param status - New status
   */
  async changeVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<VehicleResponse> {
    const url = API_ENDPOINTS.VEHICLES.CHANGE_STATUS.replace(':vehicleId', vehicleId);
    const params = new URLSearchParams({ status });
    const response = await apiClient.patch(`${url}?${params.toString()}`);
    return response.data;
  }

  /**
   * Increment rent count (ADMIN/STAFF)
   * @param vehicleId - Vehicle UUID
   */
  async incrementRentCount(vehicleId: string): Promise<VehicleResponse> {
    const url = API_ENDPOINTS.VEHICLES.INCREMENT_RENT_COUNT.replace(':vehicleId', vehicleId);
    const response = await apiClient.patch(url);
    return response.data;
  }

  /**
   * Upload vehicle photos (ADMIN/STAFF)
   * @param vehicleId - Vehicle UUID
   * @param files - Array of image files
   */
  async uploadVehiclePhotos(vehicleId: string, files: File[]): Promise<VehicleResponse> {
    const url = API_ENDPOINTS.VEHICLES.UPLOAD_PHOTOS.replace(':vehicleId', vehicleId);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ============== HELPER METHODS ==============

  /**
   * Get vehicle status text in Vietnamese
   */
  getStatusText(status: VehicleStatus): string {
    const statusTexts: Record<VehicleStatus, string> = {
      AVAILABLE: 'Khả dụng',
      RENTED: 'Đang cho thuê',
      MAINTENANCE: 'Bảo trì',
      OUT_OF_SERVICE: 'Ngừng hoạt động',
    };
    return statusTexts[status];
  }

  /**
   * Get vehicle status badge color
   */
  getStatusColor(status: VehicleStatus): string {
    const colors: Record<VehicleStatus, string> = {
      AVAILABLE: 'bg-green-100 text-green-800',
      RENTED: 'bg-blue-100 text-blue-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      OUT_OF_SERVICE: 'bg-red-100 text-red-800',
    };
    return colors[status];
  }

  /**
   * Get fuel type text in Vietnamese
   */
  getFuelTypeText(fuelType: FuelType): string {
    const fuelTexts: Record<FuelType, string> = {
      ELECTRIC: 'Điện',
      HYBRID: 'Hybrid',
      GASOLINE: 'Xăng',
      DIESEL: 'Diesel',
    };
    return fuelTexts[fuelType];
  }

  /**
   * Get fuel type icon
   */
  getFuelTypeIcon(fuelType: FuelType): string {
    const icons: Record<FuelType, string> = {
      ELECTRIC: '⚡',
      HYBRID: '🔋',
      GASOLINE: '⛽',
      DIESEL: '🛢️',
    };
    return icons[fuelType];
  }

  /**
   * Format price per hour
   */
  formatPricePerHour(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price) + '/giờ';
  }

  /**
   * Format price per day
   */
  formatPricePerDay(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price) + '/ngày';
  }

  /**
   * Calculate total rental cost
   */
  calculateRentalCost(vehicle: VehicleResponse, hours: number): {
    hourlyTotal: number;
    dailyTotal: number;
    recommended: 'hourly' | 'daily';
    recommendedTotal: number;
  } {
    const hourlyTotal = vehicle.pricePerHour * hours;
    const days = Math.ceil(hours / 24);
    const dailyTotal = vehicle.pricePerDay * days;

    return {
      hourlyTotal,
      dailyTotal,
      recommended: dailyTotal < hourlyTotal ? 'daily' : 'hourly',
      recommendedTotal: Math.min(hourlyTotal, dailyTotal),
    };
  }

  /**
   * Check if vehicle is available
   */
  isAvailable(vehicle: VehicleResponse): boolean {
    return vehicle.status === VehicleStatus.AVAILABLE;
  }

  /**
   * Check if vehicle is electric
   */
  isElectric(vehicle: VehicleResponse): boolean {
    return vehicle.fuelType === FuelType.ELECTRIC || vehicle.fuelType === FuelType.HYBRID;
  }

  /**
   * Get vehicle full name
   */
  getVehicleName(vehicle: VehicleResponse): string {
    return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
  }

  /**
   * Filter vehicles by price range
   */
  filterByPriceRange(vehicles: VehicleResponse[], minPrice?: number, maxPrice?: number): VehicleResponse[] {
    return vehicles.filter(v => {
      const price = v.pricePerDay;
      if (minPrice && price < minPrice) return false;
      if (maxPrice && price > maxPrice) return false;
      return true;
    });
  }

  /**
   * Filter vehicles by seats
   */
  filterBySeats(vehicles: VehicleResponse[], minSeats: number): VehicleResponse[] {
    return vehicles.filter(v => v.seats >= minSeats);
  }

  /**
   * Sort vehicles by price
   */
  sortByPrice(vehicles: VehicleResponse[], ascending: boolean = true): VehicleResponse[] {
    return [...vehicles].sort((a, b) => {
      const comparison = a.pricePerDay - b.pricePerDay;
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Sort vehicles by popularity (rent count)
   */
  sortByPopularity(vehicles: VehicleResponse[]): VehicleResponse[] {
    return [...vehicles].sort((a, b) => b.rentCount - a.rentCount);
  }

  /**
   * Sort vehicles by newest
   */
  sortByNewest(vehicles: VehicleResponse[]): VehicleResponse[] {
    return [...vehicles].sort((a, b) => b.year - a.year);
  }

  /**
   * Search vehicles by keyword
   */
  searchVehicles(vehicles: VehicleResponse[], query: string): VehicleResponse[] {
    const lowerQuery = query.toLowerCase();
    return vehicles.filter(
      v =>
        v.name.toLowerCase().includes(lowerQuery) ||
        v.brand.toLowerCase().includes(lowerQuery) ||
        v.model.toLowerCase().includes(lowerQuery) ||
        v.licensePlate.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get unique brands from vehicle list
   */
  getUniqueBrands(vehicles: VehicleResponse[]): string[] {
    const brands = new Set(vehicles.map(v => v.brand));
    return Array.from(brands).sort();
  }

  /**
   * Get unique fuel types from vehicle list
   */
  getUniqueFuelTypes(vehicles: VehicleResponse[]): FuelType[] {
    const fuelTypes = new Set(vehicles.map(v => v.fuelType));
    return Array.from(fuelTypes);
  }

  /**
   * Get vehicle statistics
   */
  getVehicleStats(vehicles: VehicleResponse[]) {
    return {
      total: vehicles.length,
      byStatus: {
        AVAILABLE: vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length,
        RENTED: vehicles.filter(v => v.status === VehicleStatus.RENTED).length,
        MAINTENANCE: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length,
        OUT_OF_SERVICE: vehicles.filter(v => v.status === VehicleStatus.OUT_OF_SERVICE).length,
      },
      byFuelType: {
        ELECTRIC: vehicles.filter(v => v.fuelType === FuelType.ELECTRIC).length,
        HYBRID: vehicles.filter(v => v.fuelType === FuelType.HYBRID).length,
        GASOLINE: vehicles.filter(v => v.fuelType === FuelType.GASOLINE).length,
        DIESEL: vehicles.filter(v => v.fuelType === FuelType.DIESEL).length,
      },
      averagePrice: vehicles.reduce((sum, v) => sum + v.pricePerDay, 0) / vehicles.length || 0,
      totalRentCount: vehicles.reduce((sum, v) => sum + v.rentCount, 0),
    };
  }

  /**
   * Validate vehicle data
   */
  validateVehicleData(data: CreateVehicleRequest | UpdateVehicleRequest): string[] {
    const errors: string[] = [];

    if ('licensePlate' in data && data.licensePlate) {
      if (!/^[0-9A-Z]{6,10}$/.test(data.licensePlate.replace(/[-\s]/g, ''))) {
        errors.push('Biển số xe không hợp lệ');
      }
    }

    if ('year' in data && data.year) {
      const currentYear = new Date().getFullYear();
      if (data.year < 2000 || data.year > currentYear + 1) {
        errors.push('Năm sản xuất không hợp lệ');
      }
    }

    if ('seats' in data && data.seats) {
      if (data.seats < 2 || data.seats > 16) {
        errors.push('Số ghế phải từ 2 đến 16');
      }
    }

    if ('pricePerHour' in data && data.pricePerHour) {
      if (data.pricePerHour < 10000) {
        errors.push('Giá thuê theo giờ quá thấp');
      }
    }

    if ('pricePerDay' in data && data.pricePerDay) {
      if (data.pricePerDay < 100000) {
        errors.push('Giá thuê theo ngày quá thấp');
      }
    }

    return errors;
  }

  /**
   * Get recommended vehicles (available, popular, good price)
   */
  getRecommendedVehicles(vehicles: VehicleResponse[], limit: number = 6): VehicleResponse[] {
    const available = vehicles.filter(v => v.status === VehicleStatus.AVAILABLE);
    
    // Score based on popularity and price
    const scored = available.map(v => ({
      vehicle: v,
      score: v.rentCount * 0.7 + (1 / (v.pricePerDay / 1000000)) * 0.3,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.vehicle);
  }

  /**
   * Format mileage
   */
  formatMileage(mileage?: number): string {
    if (!mileage) return '-';
    return new Intl.NumberFormat('vi-VN').format(mileage) + ' km';
  }

  /**
   * Get transmission text
   */
  getTransmissionText(transmission?: string): string {
    const transmissions: Record<string, string> = {
      AUTOMATIC: 'Tự động',
      MANUAL: 'Số sàn',
    };
    return transmission ? (transmissions[transmission] || transmission) : '-';
  }
}

// Export singleton instance
const vehicleService = new VehicleService();
export default vehicleService;
