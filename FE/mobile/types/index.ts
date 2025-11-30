// ==================== ENUMS ====================

export enum UserRole {
  RENTER = "RENTER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  MAINTENANCE = "MAINTENANCE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export enum StationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  MOMO = "MOMO",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}

// ==================== API WRAPPER ====================

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

export interface PageMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ==================== AUTH ====================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ConfirmAccountRequest {
  email: string;
  confirmationCode: string;
}

// ==================== USER ====================

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  cognitoSub?: string;
  avatarUrl?: string;
  role: UserRole;
  licenseNumber?: string;
  identityNumber?: string;
  licenseCardFrontImageUrl?: string;
  licenseCardBackImageUrl?: string;
  isLicenseVerified: boolean;
  verifiedAt?: string;
  stationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  identityNumber?: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

// ==================== STATION ====================

export interface StationResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: string;
  longitude: string;
  hotline?: string;
  status: StationStatus;
  photo?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StationDetailResponse extends StationResponse {
  totalVehicles: number;
  availableVehicles: number;
  vehicles: VehicleResponse[];
}

export interface CreateStationRequest {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hotline?: string;
  startTime?: string;
  endTime?: string;
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  hotline?: string;
  status?: StationStatus;
  startTime?: string;
  endTime?: string;
}

export interface NearbyStationSearchRequest {
  latitude: number;
  longitude: number;
  radius: number;
  page?: number;
  size?: number;
}

export interface NearbyStationResponse extends StationResponse {
  distance: number;
}

export interface NearbyStationsPageResponse {
  stations: NearbyStationResponse[];
  metadata: PageMetadata;
}

// ==================== VEHICLE ====================

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
  status: VehicleStatus;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  polices?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDetailResponse extends VehicleResponse {
  stationName: string;
  isAvailable: boolean;
}

export interface CreateVehicleRequest {
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  fuelType: string;
  capacity: number;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  polices?: string[];
}

export interface UpdateVehicleRequest {
  name?: string;
  color?: string;
  status?: VehicleStatus;
  hourlyRate?: number;
  dailyRate?: number;
  depositAmount?: number;
  polices?: string[];
}

// ==================== BOOKING ====================

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
  momoPayment?: MoMoPaymentResponse;
  createdAt: string;
}

export interface CreateBookingRequest {
  vehicleId: string;
  stationId: string;
  startTime: string;
  expectedEndTime: string;
  pickupNote?: string;
}

export interface UpdateBookingRequest {
  expectedEndTime?: string;
  pickupNote?: string;
  returnNote?: string;
  extraFee?: number;
}

// ==================== PAYMENT ====================

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
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

export interface MoMoCallbackRequest {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

// ==================== LEGACY TYPES (Keep for compatibility) ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
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
