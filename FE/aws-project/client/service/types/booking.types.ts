// Booking Enums
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Booking Request DTOs
export interface CreateBookingRequest {
  vehicleId: string; // UUID
  stationId: string; // UUID - Station where vehicle is picked up
  startTime: string; // ISO datetime
  expectedEndTime: string; // ISO datetime
  pickupNote?: string; // Optional note for pickup
}

// Legacy interface for backward compatibility
export interface CreateBookingRequestLegacy {
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

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: string;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}

export interface BookingWithPaymentResponse {
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
  status: string;
  basePrice: number;
  depositPaid: number;
  totalAmount: number;
  pickupNote?: string;
  paymentStatus: string;
  momoPayment?: MomoPaymentResponse;
  createdAt?: string;
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
  sortDirection?: "ASC" | "DESC";
  status?: BookingStatus;
  vehicleId?: string;
  stationId?: string;
}
