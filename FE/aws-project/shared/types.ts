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

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  seats: number;
  transmission: "automatic" | "manual";
  fuel_type: "electric" | "gasoline" | "diesel" | "hybrid";
  price_per_day: number;
  status: "available" | "rented" | "maintenance" | "out_of_service";
  images: string[];
  features: string[];
  stationid: string;
  created_at: string;
  updated_at: string;
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
