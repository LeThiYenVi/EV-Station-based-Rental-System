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
  checked_out_staff?: User;
  checked_in_staff?: User;
}

// ==================== VEHICLE ====================

export type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "out_of_service";
export type TransmissionType = "automatic" | "manual";
export type FuelType = "electric" | "gasoline" | "diesel" | "hybrid";
export type MaintenanceType = "regular" | "repair" | "inspection" | "emergency";

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  brand: string;
  year: number;
  license_plate: string;
  color: string;
  seats: number;
  transmission: TransmissionType;
  fuel_type: FuelType;

  // Pricing
  price_per_hour: number;
  price_per_day: number;
  price_per_week: number;

  // EV Specific
  battery_capacity?: number;
  range?: number;
  charging_time?: number;

  // Engine specs
  engine_power?: number;
  max_speed?: number;
  fuel_consumption?: number;

  // Status & availability
  status: VehicleStatus;
  mileage: number;

  // Media & features
  images: string[];
  features: string[];
  description?: string;

  // Location
  stationid: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Populated fields (statistics)
  total_bookings?: number;
  total_revenue?: number;
  average_rating?: number;
}

export interface VehiclePromotion {
  id: string;
  vehicle_id: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  description?: string;
  created_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  scheduled_date: string;
  completed_date?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  cost?: number;
  performed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleDto {
  name: string;
  model: string;
  brand: string;
  year: number;
  license_plate: string;
  color: string;
  seats: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  price_per_hour: number;
  price_per_day: number;
  price_per_week: number;
  battery_capacity?: number;
  range?: number;
  charging_time?: number;
  engine_power?: number;
  max_speed?: number;
  fuel_consumption?: number;
  mileage: number;
  features: string[];
  description?: string;
  stationid: string;
}

export interface UpdateVehicleDto {
  name?: string;
  model?: string;
  brand?: string;
  year?: number;
  license_plate?: string;
  color?: string;
  seats?: number;
  transmission?: TransmissionType;
  fuel_type?: FuelType;
  price_per_hour?: number;
  price_per_day?: number;
  price_per_week?: number;
  battery_capacity?: number;
  range?: number;
  charging_time?: number;
  engine_power?: number;
  max_speed?: number;
  fuel_consumption?: number;
  mileage?: number;
  features?: string[];
  description?: string;
  status?: VehicleStatus;
}

export interface VehicleFilterParams {
  search?: string;
  status?: VehicleStatus;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  seats?: number;
  min_price?: number;
  max_price?: number;
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
