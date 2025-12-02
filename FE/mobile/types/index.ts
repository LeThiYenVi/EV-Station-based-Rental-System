export interface User {
  id: string;
  email: string;
  name: string; // Mapped from fullName
  phone?: string;
  avatar?: string; // Mapped from avatarUrl
  role?: string;
  isLicenseVerified?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableVehicles: number;
  totalSlots: number;
}

export interface StationResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  qrCode: string;
  type: "scooter" | "bike";
  battery: number;
  stationId: string;
}

export interface Rental {
  id: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  cost: number;
  status: "active" | "completed";
}

export interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "notification" | "chat";
}

export interface Trip {
  id: string;
  date: string;
  from: string;
  to: string;
  duration: string;
  cost: number;
  status: string;
}

export interface VehicleResponse {
  id: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  fuelType: string;
  rating: number;
  capacity: number;
  rentCount: number;
  photos: string[];
  status: string;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  policies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StationDetailResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string | null;
  startTime: string;
  endTime: string;
  totalVehicles: number;
  availableVehicles: number;
  vehicles: VehicleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  vehicleId: string;
  startTime: string;
  expectedEndTime: string;
  pickupNote?: string;
}

// User object in booking
export interface BookingUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string | null;
  cognitoSub: string;
  avatarUrl: string;
  role: string;
  licenseNumber: string | null;
  identityNumber: string | null;
  licenseCardFrontImageUrl: string | null;
  licenseCardBackImageUrl: string | null;
  isLicenseVerified: boolean;
  verifiedAt: string | null;
  stationId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Vehicle object in booking
export interface BookingVehicle {
  id: string;
  stationId: string;
  stationName: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  fuelType: string;
  rating: number;
  capacity: number;
  rentCount: number;
  photos: string[] | null;
  status: string;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Station object in booking
export interface BookingStation {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// New nested booking response structure
export interface BookingResponse {
  id: string;
  bookingCode: string;
  renter: BookingUser;
  vehicle: BookingVehicle;
  station: BookingStation;
  startTime: string;
  expectedEndTime: string;
  actualEndTime: string | null;
  status: string;
  checkedOutBy: BookingUser | null;
  checkedInBy: BookingUser | null;
  basePrice: number;
  depositPaid: number;
  extraFee: number | null;
  totalAmount: number;
  pickupNote: string | null;
  returnNote: string | null;
  paymentStatus: string;
  durationHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoMoPaymentResponse {
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

export interface BookingWithPaymentResponse extends BookingResponse {
  momoPayment: MoMoPaymentResponse;
}
