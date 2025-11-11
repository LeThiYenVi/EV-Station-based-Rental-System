// Booking Enums
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Booking Request DTOs
export interface CreateBookingRequest {
  vehicleId: string; // UUID
  pickupStationId: string; // UUID
  returnStationId: string; // UUID
  pickupTime: string; // ISO datetime
  returnTime: string; // ISO datetime
  totalPrice?: number;
  notes?: string;
}

export interface UpdateBookingRequest {
  pickupTime?: string;
  returnTime?: string;
  pickupStationId?: string;
  returnStationId?: string;
  notes?: string;
}

// Booking Response DTOs
export interface BookingResponse {
  id: string; // UUID
  bookingCode: string;
  vehicleId: string;
  vehicleName?: string;
  renterId: string;
  renterName?: string;
  pickupStationId: string;
  pickupStationName?: string;
  returnStationId: string;
  returnStationName?: string;
  pickupTime: string;
  returnTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDetailResponse extends BookingResponse {
  vehicle?: {
    id: string;
    name: string;
    model: string;
    plateNumber: string;
    imageUrl?: string;
    pricePerDay: number;
  };
  renter?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  pickupStation?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  returnStation?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    method: string;
    transactionId?: string;
  };
}

export interface BookingWithPaymentResponse extends BookingResponse {
  paymentUrl?: string;
  paymentId?: string;
}

// Pagination
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Query params
export interface BookingQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: BookingStatus;
  vehicleId?: string;
  stationId?: string;
}
