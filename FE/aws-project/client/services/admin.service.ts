/**
 * Admin Service - Tích hợp API từ AdminApi.md
 * Tất cả endpoints yêu cầu role ADMIN và JWT token
 */

import apiClient, { ApiResponse } from "@/service/api/apiClient";

// ==================== TYPES ====================

// Dashboard Summary Types
export interface UserReportAdminDashboardSummary {
  totalUser: number;
  totalVerifiedUser: number;
  totalBlockedUser: number;
}

export interface VehicleReportAdminDashboardSummary {
  totalVehicles: number;
  totalAvailable: number;
  totalOnGoing: number;
  totalMaintenance: number;
}

export interface BookingReportAdminDashboardSummary {
  totalBooking: number;
  totalConfirmBooking: number;
  totalOnGoingBooking: number;
  totalRevenueFromCompletedBooking: number;
}

export interface RevenueReportAdminDashboardSummary {
  todayRevenue: number;
  lastPeriodRevenue: number;
  growthPercentage: number;
}

export interface AdminDashboardSummaryResponse {
  userReport: UserReportAdminDashboardSummary;
  vehicleReport: VehicleReportAdminDashboardSummary;
  bookingReport: BookingReportAdminDashboardSummary;
  revenueReport: RevenueReportAdminDashboardSummary;
}

// Revenue Chart Types
export interface RevenueAndBookingInChartResponse {
  timeLabel: string;
  totalRevenue: number;
  totalBookings: number;
}

// Vehicle Status Distribution
export interface VehicleStatusDistributionResponse {
  availableCount: number;
  onGoingCount: number;
  maintenanceCount: number;
}

// Booking By Type
export interface BookingByTypeResponse {
  type: string;
  count: number;
}

// New Bookings
export interface NewBookingResponse {
  bookingId: string;
  bookingCode: string;
  renterName: string;
  vehicleName: string;
  createdAt: string;
  status: string;
}

// Booking Performance
export interface BookingPerformanceResponse {
  completionRate: number;
  cancellationRate: number;
  averageRentalDurationHours: number;
}

// Maintenance Overview
export interface MaintenanceOverviewResponse {
  vehiclesInMaintenance: number;
  upcomingMaintenanceCount: number;
  overdueMaintenanceCount: number;
}

// User Management Metrics
export interface MetricUserManagementResponse {
  totalUser: number;
  totalVerifiedUser: number;
  totalBlockedUser: number;
}

// User Response
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  cognitoSub: string;
  avatarUrl?: string;
  role: string;
  licenseNumber?: string;
  identityNumber?: string;
  licenseCardFrontImageUrl?: string;
  licenseCardBackImageUrl?: string;
  isLicenseVerified?: boolean;
  verifiedAt?: string;
  stationId?: string;
  totalBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  createdAt: string;
  updatedAt: string;
}

// Vehicle Management Metrics
export interface MetricVehicleManagementResponse {
  totalVehicles: number;
  totalAvailable: number;
  totalOnGoing: number;
  totalMaintenance: number;
}

// Vehicle Response
export interface VehicleResponse {
  id: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color?: string;
  fuelType: string;
  rating: number;
  capacity: number;
  rentCount: number;
  photos: string[];
  status: string;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  polices: string[];
  createdAt: string;
  updatedAt: string;
}

// Booking Metrics
export interface MetricBookingDashboardResponse {
  totalBooking: number;
  totalRevenueFromCompletedBooking: number;
  totalConfirmBooking: number;
  totalOnGoingBooking: number;
}

// Booking Response
export interface BookingResponse {
  id: string;
  bookingCode: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  stationId: string;
  stationName: string;
  startTime: string;
  expectedEndTime: string;
  actualEndTime?: string;
  status: string;
  checkedOutById?: string;
  checkedOutByName?: string;
  checkedInById?: string;
  checkedInByName?: string;
  basePrice: number;
  depositPaid: number;
  extraFee: number;
  totalAmount: number;
  pickupNote?: string;
  returnNote?: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Revenue Types
export interface YearlyRevenueComparisonResponse {
  currentYearRevenue: number;
  previousYearRevenue: number;
  growthPercentage: number;
}

export interface RevenueByYearResponse {
  year: number;
  totalRevenue: number;
}

export interface DetailRevenueResponse {
  revenueFromRental: number;
  revenueFromExtraFee: number;
}

// Top Performers
export interface TopVehicleResponse {
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  totalRevenue: number;
  totalBookings: number;
}

export interface TopCustomerResponse {
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalRevenue: number;
  totalBookings: number;
}

// Station Response
export interface StationResponse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ADMIN DASHBOARD ENDPOINTS ====================

export const adminDashboardService = {
  /**
   * GET /api/admin/dashboard/summary
   * Lấy tổng quan dashboard admin
   */
  getDashboardSummary: async (): Promise<
    ApiResponse<AdminDashboardSummaryResponse>
  > => {
    const response = await apiClient.get<AdminDashboardSummaryResponse>(
      "/admin/dashboard/summary",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/revenue-chart
   * Lấy dữ liệu biểu đồ doanh thu & booking
   */
  getRevenueChart: async (): Promise<
    ApiResponse<RevenueAndBookingInChartResponse[]>
  > => {
    const response = await apiClient.get<RevenueAndBookingInChartResponse[]>(
      "/admin/dashboard/revenue-chart",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/vehicle-status
   * Lấy phân bổ trạng thái xe
   */
  getVehicleStatusDistribution: async (): Promise<
    ApiResponse<VehicleStatusDistributionResponse>
  > => {
    const response = await apiClient.get<VehicleStatusDistributionResponse>(
      "/admin/dashboard/vehicle-status",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/booking-by-type
   * Lấy phân bổ booking theo loại
   */
  getBookingByType: async (): Promise<ApiResponse<BookingByTypeResponse[]>> => {
    const response = await apiClient.get<BookingByTypeResponse[]>(
      "/admin/dashboard/booking-by-type",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/new-bookings
   * Lấy danh sách booking mới
   */
  getNewBookings: async (): Promise<ApiResponse<NewBookingResponse[]>> => {
    const response = await apiClient.get<NewBookingResponse[]>(
      "/admin/dashboard/new-bookings",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/booking-performance
   * Lấy chỉ số hiệu suất booking
   */
  getBookingPerformance: async (): Promise<
    ApiResponse<BookingPerformanceResponse>
  > => {
    const response = await apiClient.get<BookingPerformanceResponse>(
      "/admin/dashboard/booking-performance",
    );
    return response;
  },

  /**
   * GET /api/admin/dashboard/maintenance-overview
   * Lấy tổng quan bảo trì
   */
  getMaintenanceOverview: async (): Promise<
    ApiResponse<MaintenanceOverviewResponse>
  > => {
    const response = await apiClient.get<MaintenanceOverviewResponse>(
      "/admin/dashboard/maintenance-overview",
    );
    return response;
  },
};

// ==================== USER MANAGEMENT ENDPOINTS ====================

export const adminUserService = {
  /**
   * GET /api/admin/users/metrics
   * Lấy metrics quản lý user
   */
  getUserMetrics: async (): Promise<
    ApiResponse<MetricUserManagementResponse>
  > => {
    const response = await apiClient.get<MetricUserManagementResponse>(
      "/admin/users/metrics",
    );
    return response;
  },

  /**
   * GET /api/admin/users/filter
   * Lọc danh sách users
   */
  filterUsers: async (params: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    verification?: boolean;
  }): Promise<ApiResponse<UserResponse[]>> => {
    const response = await apiClient.get<UserResponse[]>(
      "/admin/users/filter",
      { params },
    );
    return response;
  },

  /**
   * GET /api/admin/users
   * Lấy tất cả users
   */
  getAllUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await apiClient.get<UserResponse[]>("/admin/users");
    return response;
  },

  /**
   * POST /api/admin/staff/attach-to-station
   * Gán staff vào station
   */
  attachStaffToStation: async (
    staffId: string,
    stationId: string,
  ): Promise<ApiResponse<string>> => {
    const response = await apiClient.post<string>(
      "/admin/staff/attach-to-station",
      null,
      { params: { staffId, stationId } },
    );
    return response;
  },
};

// Paginated Response Types
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: PageInfo;
}

export interface VehiclePaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// ==================== VEHICLE MANAGEMENT ENDPOINTS ====================

export const adminVehicleService = {
  /**
   * GET /api/vehicles
   * Lấy danh sách xe với phân trang
   */
  getVehicles: async (params: VehiclePaginationParams = {}): Promise<
    ApiResponse<PaginatedResponse<VehicleResponse>>
  > => {
    const response = await apiClient.get<PaginatedResponse<VehicleResponse>>(
      "/vehicles",
      { 
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          sortBy: params.sortBy ?? 'createdAt',
          sortDirection: params.sortDirection ?? 'DESC'
        } 
      },
    );
    return response;
  },

  /**
   * GET /api/admin/vehicles/metrics
   * Lấy metrics quản lý xe
   */
  getVehicleMetrics: async (): Promise<
    ApiResponse<MetricVehicleManagementResponse>
  > => {
    const response = await apiClient.get<MetricVehicleManagementResponse>(
      "/admin/vehicles/metrics",
    );
    return response;
  },

  /**
   * GET /api/admin/vehicles/search
   * Tìm kiếm xe
   */
  searchVehicles: async (
    keyword?: string,
  ): Promise<ApiResponse<VehicleResponse[]>> => {
    const response = await apiClient.get<VehicleResponse[]>(
      "/admin/vehicles/search",
      { params: { keyword } },
    );
    return response;
  },

  /**
   * GET /api/admin/vehicles/filter
   * Lọc xe theo điều kiện
   */
  filterVehicles: async (params: {
    name?: string;
    status?: string;
    type?: string;
    capacity?: number;
  }): Promise<ApiResponse<VehicleResponse[]>> => {
    const response = await apiClient.get<VehicleResponse[]>(
      "/admin/vehicles/filter",
      { params },
    );
    return response;
  },

  /**
   * POST /api/vehicles
   * Tạo xe mới
   */
  createVehicle: async (data: {
    stationId: string;
    licensePlate: string;
    name: string;
    brand: string;
    color?: string;
    fuelType: string;
    capacity: number;
    hourlyRate: number;
    dailyRate: number;
    depositAmount: number;
    polices?: string[];
  }): Promise<ApiResponse<VehicleResponse>> => {
    const response = await apiClient.post<VehicleResponse>("/vehicles", data);
    return response;
  },

  /**
   * PUT /api/vehicles/{vehicleId}
   * Cập nhật xe
   */
  updateVehicle: async (
    vehicleId: string,
    data: Partial<{
      licensePlate: string;
      name: string;
      brand: string;
      color: string;
      fuelType: string;
      capacity: number;
      hourlyRate: number;
      dailyRate: number;
      depositAmount: number;
      polices: string[];
    }>,
  ): Promise<ApiResponse<VehicleResponse>> => {
    const response = await apiClient.put<VehicleResponse>(
      `/vehicles/${vehicleId}`,
      data,
    );
    return response;
  },

  /**
   * DELETE /api/vehicles/{vehicleId}
   * Xóa xe
   */
  deleteVehicle: async (vehicleId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<null>(`/vehicles/${vehicleId}`);
    return response;
  },

  /**
   * PATCH /api/vehicles/{vehicleId}/status
   * Đổi trạng thái xe
   */
  changeVehicleStatus: async (
    vehicleId: string,
    status: string,
  ): Promise<ApiResponse<VehicleResponse>> => {
    const response = await apiClient.patch<VehicleResponse>(
      `/vehicles/${vehicleId}/status`,
      null,
      { params: { status } },
    );
    return response;
  },

  /**
   * PATCH /api/vehicles/{vehicleId}/rent-count
   * Tăng số lượt thuê
   */
  incrementRentCount: async (
    vehicleId: string,
  ): Promise<ApiResponse<VehicleResponse>> => {
    const response = await apiClient.patch<VehicleResponse>(
      `/vehicles/${vehicleId}/rent-count`,
    );
    return response;
  },

  /**
   * POST /api/vehicles/{vehicleId}/photos
   * Upload ảnh xe
   */
  uploadVehiclePhotos: async (
    vehicleId: string,
    files: File[],
  ): Promise<ApiResponse<VehicleResponse>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await apiClient.post<VehicleResponse>(
      `/vehicles/${vehicleId}/photos`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response;
  },
};

// ==================== BOOKING MANAGEMENT ENDPOINTS ====================

export const adminBookingService = {
  /**
   * GET /api/admin/bookings/metrics
   * Lấy metrics quản lý booking
   */
  getBookingMetrics: async (): Promise<
    ApiResponse<MetricBookingDashboardResponse>
  > => {
    const response = await apiClient.get<MetricBookingDashboardResponse>(
      "/admin/bookings/metrics",
    );
    return response;
  },

  /**
   * GET /api/admin/bookings
   * Lấy danh sách tất cả booking
   */
  getAllBookings: async (): Promise<ApiResponse<BookingResponse[]>> => {
    const response = await apiClient.get<BookingResponse[]>("/admin/bookings");
    return response;
  },

  /**
   * POST /api/staff/bookings/{bookingId}/confirm
   * Xác nhận booking
   */
  confirmBooking: async (
    bookingId: string,
    staffId: string,
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>(
      `/staff/bookings/${bookingId}/confirm`,
      null,
      { params: { staffId } },
    );
    return response;
  },
};

// ==================== REVENUE ANALYTICS ENDPOINTS ====================

export const adminRevenueService = {
  /**
   * GET /api/admin/revenue/yearly-comparison
   * So sánh doanh thu theo năm
   */
  getYearlyComparison: async (): Promise<
    ApiResponse<YearlyRevenueComparisonResponse>
  > => {
    const response = await apiClient.get<YearlyRevenueComparisonResponse>(
      "/admin/revenue/yearly-comparison",
    );
    return response;
  },

  /**
   * GET /api/admin/revenue/by-year
   * Lấy doanh thu theo năm
   */
  getRevenueByYear: async (
    numberOfYears = 5,
  ): Promise<ApiResponse<RevenueByYearResponse[]>> => {
    const response = await apiClient.get<RevenueByYearResponse[]>(
      "/admin/revenue/by-year",
      { params: { numberOfYears } },
    );
    return response;
  },

  /**
   * GET /api/admin/revenue/detail
   * Lấy chi tiết doanh thu
   */
  getDetailRevenue: async (): Promise<ApiResponse<DetailRevenueResponse>> => {
    const response = await apiClient.get<DetailRevenueResponse>(
      "/admin/revenue/detail",
    );
    return response;
  },
};

// ==================== TOP PERFORMERS ENDPOINTS ====================

export const adminTopPerformersService = {
  /**
   * GET /api/admin/top-vehicles
   * Lấy top xe
   */
  getTopVehicles: async (
    limit = 8,
  ): Promise<ApiResponse<TopVehicleResponse[]>> => {
    const response = await apiClient.get<TopVehicleResponse[]>(
      "/admin/top-vehicles",
      { params: { limit } },
    );
    return response;
  },

  /**
   * GET /api/admin/top-customers
   * Lấy top khách hàng
   */
  getTopCustomers: async (
    limit = 8,
  ): Promise<ApiResponse<TopCustomerResponse[]>> => {
    const response = await apiClient.get<TopCustomerResponse[]>(
      "/admin/top-customers",
      { params: { limit } },
    );
    return response;
  },
};

// ==================== STATION MANAGEMENT ENDPOINTS ====================

export const adminStationService = {
  /**
   * POST /api/stations
   * Tạo station mới
   */
  createStation: async (data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    openingHours?: string;
    phone?: string;
  }): Promise<ApiResponse<StationResponse>> => {
    const response = await apiClient.post<StationResponse>("/stations", data);
    return response;
  },

  /**
   * PUT /api/stations/{stationId}
   * Cập nhật station
   */
  updateStation: async (
    stationId: string,
    data: Partial<{
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      openingHours: string;
      phone: string;
    }>,
  ): Promise<ApiResponse<StationResponse>> => {
    const response = await apiClient.put<StationResponse>(
      `/stations/${stationId}`,
      data,
    );
    return response;
  },

  /**
   * DELETE /api/stations/{stationId}
   * Xóa station
   */
  deleteStation: async (stationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<null>(`/stations/${stationId}`);
    return response;
  },

  /**
   * PATCH /api/stations/{stationId}/status
   * Đổi trạng thái station
   */
  changeStationStatus: async (
    stationId: string,
    status: string,
  ): Promise<ApiResponse<StationResponse>> => {
    const response = await apiClient.patch<StationResponse>(
      `/stations/${stationId}/status`,
      null,
      { params: { status } },
    );
    return response;
  },

  /**
   * POST /api/stations/{stationId}/photo
   * Upload ảnh station
   */
  uploadStationPhoto: async (
    stationId: string,
    file: File,
  ): Promise<ApiResponse<StationResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<StationResponse>(
      `/stations/${stationId}/photo`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response;
  },

  /**
   * GET /api/staff/by-station
   * Lấy staff theo station
   */
  getStaffByStation: async (
    stationId: string,
  ): Promise<ApiResponse<UserResponse[]>> => {
    const response = await apiClient.get<UserResponse[]>("/staff/by-station", {
      params: { stationId },
    });
    return response;
  },
};

// ==================== BLOG MANAGEMENT ENDPOINTS ====================

export const adminBlogService = {
  /**
   * POST /api/blogs
   * Tạo blog mới
   */
  createBlog: async (data: {
    title: string;
    content: string;
    tags?: string[];
    status?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>("/blogs", data);
    return response;
  },

  /**
   * PUT /api/blogs/{blogId}
   * Cập nhật blog
   */
  updateBlog: async (
    blogId: string,
    data: Partial<{
      title: string;
      content: string;
      tags: string[];
      status: string;
    }>,
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.put<any>(`/blogs/${blogId}`, data);
    return response;
  },

  /**
   * DELETE /api/blogs/{blogId}
   * Xóa blog
   */
  deleteBlog: async (blogId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<null>(`/blogs/${blogId}`);
    return response;
  },

  /**
   * GET /api/blogs/my
   * Lấy danh sách blog của user hiện tại
   */
  getMyBlogs: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<any[]>("/blogs/my");
    return response;
  },

  /**
   * POST /api/blogs/{blogId}/thumbnail
   * Upload thumbnail cho blog
   */
  uploadThumbnail: async (
    blogId: string,
    file: File,
  ): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<any>(
      `/blogs/${blogId}/thumbnail`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response;
  },
};

// ==================== STAFF/LICENSE VERIFICATION ENDPOINTS ====================

export const adminStaffService = {
  /**
   * POST /api/staff/users/{userId}/verify-license
   * Xác minh bằng lái xe của user
   */
  verifyUserLicense: async (
    userId: string,
    staffId: string,
    approved: boolean,
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>(
      `/staff/users/${userId}/verify-license`,
      null,
      { params: { staffId, approved } },
    );
    return response;
  },

  /**
   * GET /api/staff/by-station
   * Lấy danh sách staff theo station
   */
  getStaffByStation: async (
    stationId: string,
  ): Promise<ApiResponse<UserResponse[]>> => {
    const response = await apiClient.get<UserResponse[]>("/staff/by-station", {
      params: { stationId },
    });
    return response;
  },
};

// Export all services
export default {
  dashboard: adminDashboardService,
  users: adminUserService,
  vehicles: adminVehicleService,
  bookings: adminBookingService,
  revenue: adminRevenueService,
  topPerformers: adminTopPerformersService,
  stations: adminStationService,
  blogs: adminBlogService,
  staff: adminStaffService,
};
