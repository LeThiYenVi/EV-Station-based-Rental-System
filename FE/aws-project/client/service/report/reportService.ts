// ==========================================
// Report Service
// Handles admin reporting and analytics
// ==========================================

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type {
  RevenueByStationResponse,
  UtilizationResponse,
  PeakHourResponse,
  StaffPerformanceResponse,
  CustomerRiskResponse,
  ReportFilters,
} from '../types/report-staff-station.types';

class ReportService {
  // ============== REVENUE REPORTS ==============

  /**
   * Get revenue by station
   * @param filters - Date range and optional station filter
   * @returns Revenue data by station
   */
  async getRevenueByStation(filters: ReportFilters): Promise<RevenueByStationResponse[]> {
    const params = new URLSearchParams({
      start: filters.start.toISOString(),
      end: filters.end.toISOString(),
    });
    
    if (filters.stationId) {
      params.append('stationId', filters.stationId);
    }

    const response = await apiClient.get(
      `${API_ENDPOINTS.REPORTS.REVENUE_BY_STATION}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== UTILIZATION REPORTS ==============

  /**
   * Get vehicle utilization rates
   * @param filters - Date range and optional station filter
   * @returns Utilization data by station
   */
  async getUtilization(filters: ReportFilters): Promise<UtilizationResponse[]> {
    const params = new URLSearchParams({
      start: filters.start.toISOString(),
      end: filters.end.toISOString(),
    });
    
    if (filters.stationId) {
      params.append('stationId', filters.stationId);
    }

    const response = await apiClient.get(
      `${API_ENDPOINTS.REPORTS.UTILIZATION}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== PEAK HOURS REPORTS ==============

  /**
   * Get peak booking hours
   * @param filters - Date range and optional station filter
   * @returns Peak hours data
   */
  async getPeakHours(filters: ReportFilters): Promise<PeakHourResponse[]> {
    const params = new URLSearchParams({
      start: filters.start.toISOString(),
      end: filters.end.toISOString(),
    });
    
    if (filters.stationId) {
      params.append('stationId', filters.stationId);
    }

    const response = await apiClient.get(
      `${API_ENDPOINTS.REPORTS.PEAK_HOURS}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== STAFF PERFORMANCE REPORTS ==============

  /**
   * Get staff performance metrics
   * @param filters - Date range and optional station filter
   * @returns Staff performance data
   */
  async getStaffPerformance(filters: ReportFilters): Promise<StaffPerformanceResponse[]> {
    const params = new URLSearchParams({
      start: filters.start.toISOString(),
      end: filters.end.toISOString(),
    });
    
    if (filters.stationId) {
      params.append('stationId', filters.stationId);
    }

    const response = await apiClient.get(
      `${API_ENDPOINTS.REPORTS.STAFF_PERFORMANCE}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== CUSTOMER RISK REPORTS ==============

  /**
   * Get customer risk assessment
   * @param minBookings - Minimum bookings to include (default: 3)
   * @returns Customer risk data
   */
  async getCustomerRisk(minBookings: number = 3): Promise<CustomerRiskResponse[]> {
    const params = new URLSearchParams({
      minBookings: minBookings.toString(),
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.REPORTS.CUSTOMER_RISK}?${params.toString()}`
    );
    return response.data.data;
  }

  // ============== HELPER METHODS ==============

  /**
   * Format currency for Vietnamese Dong
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  /**
   * Format utilization rate as percentage
   */
  formatUtilizationRate(rate: number): string {
    return `${rate.toFixed(1)}%`;
  }

  /**
   * Get utilization color based on rate
   */
  getUtilizationColor(rate: number): string {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-blue-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Get risk level text in Vietnamese
   */
  getRiskLevelText(level: string): string {
    const riskLevels: Record<string, string> = {
      LOW: 'Thấp',
      MEDIUM: 'Trung bình',
      HIGH: 'Cao',
      CRITICAL: 'Nghiêm trọng',
    };
    return riskLevels[level] || level;
  }

  /**
   * Get risk level color
   */
  getRiskLevelColor(level: string): string {
    const colors: Record<string, string> = {
      LOW: 'text-green-600 bg-green-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      HIGH: 'text-orange-600 bg-orange-50',
      CRITICAL: 'text-red-600 bg-red-50',
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
  }

  /**
   * Format hour for peak hours (e.g., "08:00 - 09:00")
   */
  formatPeakHour(hour: number): string {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = ((hour + 1) % 24).toString().padStart(2, '0');
    return `${startHour}:00 - ${endHour}:00`;
  }

  /**
   * Format date range for display
   */
  formatDateRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('vi-VN', options);
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  /**
   * Calculate cancellation rate percentage
   */
  calculateCancellationRate(cancelled: number, total: number): number {
    if (total === 0) return 0;
    return (cancelled / total) * 100;
  }

  /**
   * Get top performing staff (top 5 by revenue)
   */
  getTopPerformers(staff: StaffPerformanceResponse[], limit: number = 5): StaffPerformanceResponse[] {
    return [...staff]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  /**
   * Get high-risk customers (risk score >= 70)
   */
  getHighRiskCustomers(customers: CustomerRiskResponse[]): CustomerRiskResponse[] {
    return customers.filter(c => c.riskScore >= 70);
  }

  /**
   * Calculate average rating
   */
  calculateAverageRating(staff: StaffPerformanceResponse[]): number {
    const validRatings = staff.filter(s => s.customerRating !== undefined);
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, s) => acc + (s.customerRating || 0), 0);
    return sum / validRatings.length;
  }

  /**
   * Get date range presets in Vietnamese
   */
  getDateRangePresets() {
    const now = new Date();
    
    return {
      today: {
        label: 'Hôm nay',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: now,
      },
      yesterday: {
        label: 'Hôm qua',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
      last7Days: {
        label: '7 ngày qua',
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now,
      },
      last30Days: {
        label: '30 ngày qua',
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: now,
      },
      thisMonth: {
        label: 'Tháng này',
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: now,
      },
      lastMonth: {
        label: 'Tháng trước',
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
      },
    };
  }
}

// Export singleton instance
const reportService = new ReportService();
export default reportService;
