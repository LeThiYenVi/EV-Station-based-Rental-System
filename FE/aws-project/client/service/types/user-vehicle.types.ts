// ==========================================
// User and Vehicle Types
// ==========================================

// ============== USER TYPES ==============

export enum UserRole {
  RENTER = 'RENTER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string; // API expects "phone"
  phoneNumber?: string; // Keep for backward compatibility
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  identityNumber?: string; // ID card number
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
  stationId?: string;
}

// ============== VEHICLE TYPES ==============

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum FuelType {
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL'
}

export interface VehicleResponse {
  id: string;
  stationId: string;
  stationName?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  seats: number;
  fuelType: FuelType;
  transmission?: string; // 'AUTOMATIC' | 'MANUAL'
  pricePerHour: number;
  pricePerDay: number;
  status: VehicleStatus;
  mileage?: number;
  rentCount: number;
  photoUrls?: string[];
  features?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDetailResponse extends VehicleResponse {
  station?: {
    id: string;
    name: string;
    address: string;
    city: string;
    phoneNumber?: string;
  };
  specifications?: {
    enginePower?: string;
    batteryCapacity?: string;
    range?: number; // km
    chargingTime?: string;
    topSpeed?: number; // km/h
    acceleration?: string; // 0-100 km/h
  };
  currentBooking?: {
    id: string;
    bookingCode: string;
    startTime: string;
    endTime: string;
    customerName: string;
  };
  maintenanceHistory?: Array<{
    date: string;
    type: string;
    description: string;
    cost?: number;
  }>;
}

export interface CreateVehicleRequest {
  stationId: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  seats: number;
  fuelType: FuelType;
  transmission?: string;
  pricePerHour: number;
  pricePerDay: number;
  mileage?: number;
  features?: string[];
  description?: string;
}

export interface UpdateVehicleRequest {
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  color?: string;
  seats?: number;
  fuelType?: FuelType;
  transmission?: string;
  pricePerHour?: number;
  pricePerDay?: number;
  status?: VehicleStatus;
  mileage?: number;
  features?: string[];
  description?: string;
  stationId?: string;
}

export interface VehicleFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  stationId?: string;
  status?: VehicleStatus;
  fuelType?: FuelType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
}

export interface AvailableVehicleFilters {
  stationId: string;
  fuelType?: string;
  brand?: string;
  startTime?: Date;
  endTime?: Date;
}
