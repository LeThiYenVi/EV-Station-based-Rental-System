import { UserResponse } from "./User";

// Auth Request Types
export interface RegisterRequest {
  email: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: string; // default "RENTER"
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotUserPasswordRequest {
  email: string;
}

export interface ResetUserPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangeUserPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyAccountRequest {
  email: string;
  code: string;
}

// Auth Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface GoogleOAuthUrlResponse {
  authUrl: string;
}
