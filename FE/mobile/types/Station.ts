import { StationStatus } from "./Enums";
import { VehicleResponse } from "./Vehicle";

// Station Response Types
export interface StationResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: string;
  longitude: string;
  hotline: string;
  status: StationStatus;
  photo?: string;
  startTime: string; // LocalDateTime as ISO string
  endTime: string; // LocalDateTime as ISO string
  createdAt: string;
  updatedAt: string;
}

export interface StationDetailResponse extends StationResponse {
  totalVehicles: number;
  availableVehicles: number;
  vehicles: VehicleResponse[];
}

// Station Request Types
export interface CreateStationRequest {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hotline?: string;
  photo?: string;
  startTime: string;
  endTime: string;
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  hotline?: string;
  photo?: string;
  status?: StationStatus;
  startTime?: string;
  endTime?: string;
  rating?: number;
}

// Location Search Types
export interface NearbyStationSearchRequest {
  latitude: string;
  longitude: string;
  radiusKm?: number; // 1-100, default 10
  limit?: number; // 1-50, default 10
  minRating?: number;
  fuelType?: string;
  brand?: string;
  startTime?: string;
  endTime?: string;
}

export interface AvailableVehicleSummary {
  id: string;
  name: string;
  brand: string;
  licensePlate: string;
  fuelType: string;
  rating: number;
  capacity: number;
  hourlyRate: number;
  rentCount: number;
  dailyRate: number;
  photos: string[];
  depositAmount: number;
}

export interface NearbyStationResponse {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: string;
  longitude: string;
  hotline: string;
  status: string;
  photo?: string;
  distanceKm: number;
  startTime: string;
  endTime: string;
  availableVehiclesCount: number;
  availableVehicles: AvailableVehicleSummary[];
}

export interface UserLocation {
  latitude: string;
  longitude: string;
}

export interface SearchMetadata {
  totalResults: number;
  radiusKm: number;
  returnedCount: number;
  searchTime: string;
}

export interface NearbyStationsPageResponse {
  stations: NearbyStationResponse[];
  userLocation: UserLocation;
  metadata: SearchMetadata;
}
