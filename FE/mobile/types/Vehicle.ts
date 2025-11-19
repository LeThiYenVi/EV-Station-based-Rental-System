import { FuelType, VehicleStatus } from "./Enums";

// Vehicle Response Types
export interface VehicleResponse {
  id: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color?: string;
  fuelType: FuelType;
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

export interface VehicleDetailResponse {
  id: string;
  stationId: string;
  stationName: string;
  licensePlate: string;
  name: string;
  brand: string;
  color?: string;
  fuelType: FuelType;
  rating: number;
  capacity: number;
  rentCount: number;
  photos: string[];
  status: VehicleStatus;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vehicle Request Types
export interface CreateVehicleRequest {
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color?: string;
  fuelType: FuelType;
  capacity: number;
  photos?: string[];
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
}

export interface UpdateVehicleRequest {
  stationId?: string;
  licensePlate?: string;
  name?: string;
  brand?: string;
  color?: string;
  fuelType?: FuelType;
  capacity?: number;
  photos?: string[];
  status?: VehicleStatus;
  hourlyRate?: number;
  dailyRate?: number;
  depositAmount?: number;
  rating?: number;
}

// Vehicle Search/Filter Types
export interface VehicleFilterParams {
  stationId?: string;
  fuelType?: FuelType;
  brand?: string;
  startTime?: string;
  endTime?: string;
  status?: VehicleStatus;
  minCapacity?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}
