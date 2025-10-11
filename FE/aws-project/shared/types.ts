/**
 * Shared TypeScript types for the application
 * These types match the database schema
 */

// ==================== ENUMS ====================

export type UserRole = "renter" | "staff" | "admin";
export type UserStatus = "active" | "blocked" | "pending";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "picked_up"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "deposit_paid";

export type BodyCondition = "normal" | "minor_damage" | "major_damage";

// ==================== USER ====================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  role: UserRole;
  license_number: string | null;
  identity_number: string | null;
  license_card_image_url: string | null;
  is_verified: boolean;
  verified_at: string | null;
  status: UserStatus; // Added for blocking users
  stationid: string | null; // For staff only
  created_at: string;
  updated_at: string;

  // Populated fields (not in DB, joined from other tables)
  total_bookings?: number;
  total_spent?: number;
  last_login?: string | null;
}

// For creating new user
export interface CreateUserDto {
  email: string;
  full_name: string;
  phone: string;
  password: string;
  role: UserRole;
  license_number?: string;
  identity_number?: string;
  stationid?: string;
}

// For updating user
export interface UpdateUserDto {
  email?: string;
  full_name?: string;
  phone?: string;
  role?: UserRole;
  license_number?: string;
  identity_number?: string;
  status?: UserStatus;
  stationid?: string;
  is_verified?: boolean;
}

// ==================== BOOKING ====================

export interface Booking {
  id: string;
  booking_code: string;
  renter_id: string;
  vehicle_id: string;
  start_time: string;
  expected_end_time: string;
  actual_end_time: string | null;
  status: BookingStatus;
  checked_out_by: string | null;
  checked_in_by: string | null;
  base_price: number;
  deposit_paid: number;
  extra_fee: number;
  total_amount: number;
  payment_status: PaymentStatus;
  pickup_notes: string | null;
  return_notes: string | null;
  body_condition: BodyCondition;
  photos: string[];
  created_at: string;
  updated_at: string;

  // Populated fields
  renter?: User;
  vehicle?: Vehicle;
  checked_out_staff?: User;
  checked_in_staff?: User;
}

// For creating new booking
export interface CreateBookingDto {
  renter_id: string;
  vehicle_id: string;
  start_time: string;
  expected_end_time: string;
  base_price: number;
  deposit_paid: number;
  pickup_notes?: string;
  body_condition?: BodyCondition;
}

// For updating booking
export interface UpdateBookingDto {
  status?: BookingStatus;
  checked_out_by?: string;
  checked_in_by?: string;
  actual_end_time?: string;
  extra_fee?: number;
  total_amount?: number;
  payment_status?: PaymentStatus;
  pickup_notes?: string;
  return_notes?: string;
  body_condition?: BodyCondition;
  photos?: string[];
}

// For filtering bookings
export interface BookingFilterParams {
  search?: string; // Search by booking_code
  status?: BookingStatus | "all";
  payment_status?: PaymentStatus | "all";
  renter_id?: string;
  vehicle_id?: string;
  checked_out_by?: string;
  checked_in_by?: string;
  start_date?: string; // Filter by start_time
  end_date?: string; // Filter by expected_end_time
  date_range?: "past" | "current" | "upcoming" | "all";
}

// ==================== VEHICLE ====================

/**
 * Vehicle Status - Theo ERD
 * - available: Xe sẵn sàng cho thuê
 * - rented: Xe đang được thuê
 * - maintenance: Xe đang bảo trì
 * - charging: Xe đang sạc (EV)
 * - unavailable: Xe không khả dụng
 */
export type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "charging"
  | "unavailable";

/**
 * Fuel Type - Theo ERD: type field
 * Chú ý: ERD gọi là "type" nhưng code backend dùng "fuel_type"
 */
export type FuelType = "gasoline" | "electricity";

/**
 * Vehicle Interface - Khớp 100% với ERD
 * Tất cả fields theo đúng database schema
 */
export interface Vehicle {
  // Core fields
  id: string; // uuid
  station_id: string; // FK to stations table (ERD: station_id, backend: station relation)
  license_plate: string; // Biển số xe (unique)
  name: string; // Tên xe
  brand: string; // Hãng xe
  type: FuelType; // Loại nhiên liệu: gasoline hoặc electricity (ERD field name)

  // Metrics
  rating: number; // Đánh giá (decimal)
  capacity: number; // Số ghế (integer)
  rent_count: number; // Số lần thuê (decimal -> integer là hợp lý hơn)

  // Media
  photos: string[]; // Mảng URL ảnh (text[])

  // Status
  status: VehicleStatus; // Trạng thái xe

  // Pricing
  hourly_rate: number; // Giá thuê theo giờ (decimal)
  daily_rate: number; // Giá thuê theo ngày (decimal)
  deposit_amount: number; // Tiền đặt cọc (decimal)

  // Policies
  polices: string[]; // Điều khoản thuê xe (varchar -> string[])

  // Timestamps
  created_at: string; // Timestamp tạo
  updated_at: string; // Timestamp cập nhật

  // Optional computed fields (not in DB, for UI display)
  station_name?: string; // Tên trạm (joined from stations)
  total_bookings?: number; // Tổng số lần thuê (computed)
  total_revenue?: number; // Tổng doanh thu (computed)
}

/**
 * CreateVehicleDto - Theo ERD (chỉ các fields cần thiết)
 */
export interface CreateVehicleDto {
  station_id: string; // FK to stations
  license_plate: string; // Biển số (unique, required)
  name: string; // Tên xe
  brand: string; // Hãng xe
  type: FuelType; // gasoline hoặc electricity
  capacity: number; // Số ghế
  hourly_rate: number; // Giá theo giờ
  daily_rate: number; // Giá theo ngày
  deposit_amount: number; // Tiền đặt cọc
  polices: string[]; // Điều khoản
  photos?: string[]; // Upload ảnh (optional khi tạo mới)
}

/**
 * UpdateVehicleDto - Theo ERD (tất cả fields optional)
 */
export interface UpdateVehicleDto {
  station_id?: string;
  license_plate?: string;
  name?: string;
  brand?: string;
  type?: FuelType;
  rating?: number;
  capacity?: number;
  rent_count?: number;
  photos?: string[];
  status?: VehicleStatus;
  hourly_rate?: number;
  daily_rate?: number;
  deposit_amount?: number;
  polices?: string[];
}

/**
 * VehicleFilterParams - Lọc theo ERD fields
 */
export interface VehicleFilterParams {
  search?: string; // Tìm theo name, brand, license_plate
  status?: VehicleStatus;
  type?: FuelType; // Filter theo gasoline/electricity
  capacity?: number; // Lọc theo số ghế
  min_price?: number; // Giá tối thiểu (daily_rate)
  max_price?: number; // Giá tối đa (daily_rate)
  station_id?: string; // Lọc theo trạm
}

// ==================== FILTER & PAGINATION ====================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilterParams {
  role?: UserRole | "all";
  status?: UserStatus | "all";
  is_verified?: boolean | "all";
  search?: string;
  date_from?: string;
  date_to?: string;
}
