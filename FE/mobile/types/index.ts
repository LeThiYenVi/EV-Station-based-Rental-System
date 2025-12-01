export interface User {
  id: string;
  email: string;
  name: string; // Mapped from fullName
  phone?: string;
  avatar?: string; // Mapped from avatarUrl
  role?: string;
  isLicenseVerified?: boolean;
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
