// Auth Request DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  role: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  accessToken: string;
  currentPassword: string;
  newPassword: string;
}

export interface VerifyAccountRequest {
  email: string;
  code: string;
}

// Auth Response DTOs
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string; // API returns "phone" not "phoneNumber"
  phoneNumber?: string; // Keep for backward compatibility
  cognitoSub?: string;
  role?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Extended user fields
  address?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  licenseNumber?: string;
  identityNumber?: string; // ID card number
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseCardImageUrl?: string; // API returns this field name
  licenseCardUrl?: string; // Keep for backward compatibility
  isLicenseVerified?: boolean; // API returns this field name
  licenseVerified?: boolean; // Keep for backward compatibility
  verifiedAt?: string;
  stationId?: string;
  stationName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  idToken: string;
  refreshToken?: string; // Only in response, not sent to frontend (httpOnly cookie)
  expiresIn: number;
  tokenType: string;
}

export interface GoogleAuthUrlResponse {
  authorizationUrl: string;
  state: string;
}

// UserResponse type alias for consistency with backend
export type UserResponse = User;
