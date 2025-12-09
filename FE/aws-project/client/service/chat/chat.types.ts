// Chat API Types based on AI-RESPONSE-EXAMPLES.md

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ChatRequest {
  message: string;
  user_id?: string;
  session_id?: string;
  metadata?: {
    user_location?: UserLocation;
  };
}

export interface VehicleData {
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
}

export interface StationData {
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
  totalVehicles: number;
  availableVehicles: number;
}

export interface BookingData {
  id: string;
  bookingCode: string;
  status: string;
  vehicleName: string;
  stationName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  [key: string]: any;
}

export interface ChatData {
  type: "vehicles" | "stations" | "bookings" | "mixed" | null;
  items?: VehicleData[] | StationData[] | BookingData[];
  vehicles?: VehicleData[];
  stations?: StationData[];
  bookings?: BookingData[];
}

export interface ChatMetadata {
  has_structured_data: boolean;
  data_type: "vehicles" | "stations" | "bookings" | "mixed" | null;
  items_count: number;
  response_tokens?: number;
  tools_used?: string[];
  source?: string;
  error_type?: string;
  timestamp?: string;
  vehicles_count?: number;
  stations_count?: number;
  bookings_count?: number;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  session_id: string;
  data: ChatData | null;
  error: string | null;
  metadata: ChatMetadata;
}
