// Centralized enums to match Backend domain common enums
// Import these in requests to ensure correct payloads

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum BookingType {
  ADVANCE = "ADVANCE",
  WALK_IN = "WALK_IN",
}

export enum FuelType {
  GASOLINE = "GASOLINE",
  ELECTRICITY = "ELECTRICITY",
}

export enum PaymentMethod {
  CASH = "CASH",
  MOMO = "MOMO",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
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
  CHARGING = "CHARGING",
  UNAVAILABLE = "UNAVAILABLE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

// Helper maps if some UI code uses localized labels
export const VehicleStatusLabel: Record<VehicleStatus, string> = {
  AVAILABLE: "Sẵn sàng",
  RENTED: "Đang thuê",
  MAINTENANCE: "Bảo trì",
  CHARGING: "Đang sạc",
  UNAVAILABLE: "Không khả dụng",
  OUT_OF_SERVICE: "Ngừng hoạt động",
};

export const FuelTypeLabel: Record<FuelType, string> = {
  GASOLINE: "Xăng",
  ELECTRICITY: "Điện",
};
