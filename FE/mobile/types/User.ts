import { UserRole } from "./Enums";

export interface User {
  id: string;
  userName: string;
  role: string;
}

// Full User Response from API
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  cognitoSub?: string;
  avatarUrl?: string;
  role: UserRole;
  licenseNumber?: string;
  identityNumber?: string;
  licenseCardImageUrl?: string;
  isLicenseVerified: boolean;
  verifiedAt?: string;
  stationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Update User Request
export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  licenseNumber?: string;
  identityNumber?: string;
  stationId?: string;
}

// Update User Role Request (ADMIN only)
export interface UpdateUserRoleRequest {
  role: UserRole;
}
