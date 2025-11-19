// Enum Definitions for the EV Station Rental System

export enum UserRole {
  RENTER = "RENTER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum StationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  MAINTENANCE = "MAINTENANCE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export enum FuelType {
  ELECTRIC = "ELECTRIC",
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  HYBRID = "HYBRID",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  MOMO = "MOMO",
}
