import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type {
  FleetVehicleResponse,
  VehicleStatusSummary,
  VehicleHistoryItemResponse,
  DispatchableVehiclesParams,
} from '../types/fleet-payment.types';

class FleetService {
  /**
   * Get all vehicles at a specific station
   * Requires: ADMIN or STAFF role
   */
  async getVehiclesAtStation(stationId: string): Promise<FleetVehicleResponse[]> {
    const url = API_ENDPOINTS.FLEET.VEHICLES_AT_STATION.replace(':stationId', stationId);
    const response = await apiClient.get<FleetVehicleResponse[]>(url);
    return response.data!;
  }

  /**
   * Get vehicle status summary for a station
   * Requires: ADMIN or STAFF role
   */
  async getStatusSummary(stationId: string): Promise<VehicleStatusSummary> {
    const url = API_ENDPOINTS.FLEET.STATUS_SUMMARY.replace(':stationId', stationId);
    const response = await apiClient.get<VehicleStatusSummary>(url);
    return response.data!;
  }

  /**
   * Get history of a specific vehicle
   * Requires: ADMIN or STAFF role
   */
  async getVehicleHistory(vehicleId: string): Promise<VehicleHistoryItemResponse[]> {
    const url = API_ENDPOINTS.FLEET.VEHICLE_HISTORY.replace(':vehicleId', vehicleId);
    const response = await apiClient.get<VehicleHistoryItemResponse[]>(url);
    return response.data!;
  }

  /**
   * Get dispatchable vehicles (available in time range)
   * Requires: ADMIN or STAFF role
   */
  async getDispatchableVehicles(params: DispatchableVehiclesParams): Promise<FleetVehicleResponse[]> {
    const url = API_ENDPOINTS.FLEET.DISPATCHABLE_VEHICLES.replace(':stationId', params.stationId);
    const queryParams = new URLSearchParams({
      start: params.start,
      end: params.end,
    });
    
    const response = await apiClient.get<FleetVehicleResponse[]>(
      `${url}?${queryParams.toString()}`
    );
    return response.data!;
  }

  /**
   * Calculate utilization rate
   */
  calculateUtilizationRate(summary: VehicleStatusSummary): number {
    if (summary.totalVehicles === 0) return 0;
    return (summary.rentedVehicles / summary.totalVehicles) * 100;
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      AVAILABLE: 'green',
      RENTED: 'blue',
      MAINTENANCE: 'yellow',
      OUT_OF_SERVICE: 'red',
    };
    return colorMap[status] || 'gray';
  }

  /**
   * Get status text in Vietnamese
   */
  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      AVAILABLE: 'Sẵn sàng',
      RENTED: 'Đang cho thuê',
      MAINTENANCE: 'Bảo trì',
      OUT_OF_SERVICE: 'Ngừng hoạt động',
    };
    return textMap[status] || status;
  }

  /**
   * Format vehicle display name
   */
  formatVehicleName(vehicle: FleetVehicleResponse): string {
    return `${vehicle.brand} ${vehicle.name} - ${vehicle.licensePlate}`;
  }

  /**
   * Check if vehicle is available
   */
  isVehicleAvailable(vehicle: FleetVehicleResponse): boolean {
    return vehicle.status === 'AVAILABLE';
  }

  /**
   * Format price display
   */
  formatPrice(price: number): string {
    return `${price.toLocaleString('vi-VN')} VNĐ`;
  }
}

// Export singleton instance
export const fleetService = new FleetService();
export default fleetService;
