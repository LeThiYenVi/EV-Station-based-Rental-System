// ==========================================
// Report, Staff, and Station Types
// ==========================================

// ============== REPORT TYPES ==============

export interface RevenueByStationResponse {
  stationId: string;
  stationName: string;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
}

export interface UtilizationResponse {
  stationId: string;
  stationName: string;
  totalVehicles: number;
  utilizationRate: number; // 0-100
  totalRentalHours: number;
  availableHours: number;
}

export interface PeakHourResponse {
  hour: number; // 0-23
  date: string;
  bookingCount: number;
  stationId?: string;
  stationName?: string;
}

export interface StaffPerformanceResponse {
  staffId: string;
  staffName: string;
  email: string;
  stationId?: string;
  stationName?: string;
  completedBookings: number;
  totalRevenue: number;
  averageProcessingTime?: number; // in minutes
  customerRating?: number; // 0-5
}

export interface CustomerRiskResponse {
  customerId: string;
  customerName: string;
  email: string;
  phoneNumber?: string;
  totalBookings: number;
  cancelledBookings: number;
  cancellationRate: number; // 0-100
  lateReturns: number;
  totalOverdueFees: number;
  riskScore: number; // 0-100, higher = more risky
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ReportFilters {
  start: Date;
  end: Date;
  stationId?: string;
}

// ============== STAFF TYPES ==============

// Reusing UserResponse from auth.types.ts
export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  stationId?: string;
  stationName?: string;
  createdAt: string;
  isActive: boolean;
}

// ============== STATION TYPES ==============

export enum StationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  CLOSED = 'CLOSED'
}

export interface StationResponse {
  id: string;
  name: string;
  address: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  hotline?: string;
  status: StationStatus;
  photo?: string;
  startTime?: string; // ISO datetime "2025-11-10T06:00:00"
  endTime?: string; // ISO datetime "2025-11-10T22:00:00"
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backwards compatibility
  city?: string;
  district?: string;
  ward?: string;
  phoneNumber?: string;
  email?: string;
  photoUrl?: string;
  totalVehicles?: number;
  availableVehicles?: number;
  openingTime?: string; // "08:00"
  closingTime?: string; // "20:00"
}

export interface StationDetailResponse extends StationResponse {
  description?: string;
  amenities?: string[]; // ['Parking', 'WiFi', 'Waiting Area']
  vehicles?: Array<{
    id: string;
    name: string;
    licensePlate: string;
    status: string;
  }>;
  staff?: Array<{
    id: string;
    fullName: string;
    role: string;
  }>;
  operatingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}

export interface CreateStationRequest {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  hotline?: string;
  photo?: string;
  startTime?: string; // ISO datetime
  endTime?: string; // ISO datetime
  // Legacy fields
  city?: string;
  district?: string;
  ward?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  amenities?: string[];
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  hotline?: string;
  photo?: string;
  startTime?: string;
  endTime?: string;
  status?: StationStatus;
  // Legacy fields
  city?: string;
  district?: string;
  ward?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  amenities?: string[];
}

export interface StationFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: StationStatus;
  city?: string;
}

export interface AvailableVehiclesCount {
  availableVehicles: number;
}
