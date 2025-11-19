import { BookingStatus, PaymentStatus } from "./Enums";
import { UserResponse } from "./User";
import { VehicleDetailResponse } from "./Vehicle";
import { StationResponse } from "./Station";
import { MoMoPaymentResponse } from "./Payment";

// Booking Request Types
export interface CreateBookingRequest {
  vehicleId: string;
  stationId: string;
  startTime: string; // ISO datetime string
  expectedEndTime: string; // ISO datetime string
  pickupNote?: string;
}

export interface UpdateBookingRequest {
  vehicleId?: string;
  stationId?: string;
  startTime?: string;
  expectedEndTime?: string;
  pickupNote?: string;
  returnNote?: string;
  extraFee?: number;
}

// Booking Response Types
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
  status: BookingStatus;
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
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithPaymentResponse
  extends Omit<
    BookingResponse,
    | "checkedOutById"
    | "checkedOutByName"
    | "checkedInById"
    | "checkedInByName"
    | "actualEndTime"
  > {
  momoPayment?: MoMoPaymentResponse;
}

export interface BookingDetailResponse {
  id: string;
  bookingCode: string;
  renter: UserResponse;
  vehicle: VehicleDetailResponse;
  station: StationResponse;
  startTime: string;
  expectedEndTime: string;
  actualEndTime?: string;
  status: BookingStatus;
  checkedOutBy?: UserResponse;
  checkedInBy?: UserResponse;
  basePrice: number;
  depositPaid: number;
  extraFee: number;
  totalAmount: number;
  pickupNote?: string;
  returnNote?: string;
  paymentStatus: PaymentStatus;
  durationHours: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Filter/Query Types
export interface BookingFilterParams {
  status?: BookingStatus;
  vehicleId?: string;
  stationId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}
