// Re-export VehicleResponse from user-vehicle types for compatibility
import type { VehicleResponse } from './user-vehicle.types';
export type { VehicleResponse } from './user-vehicle.types';

// Fleet Types - keeping for backwards compatibility but using VehicleResponse
export type FleetVehicleResponse = VehicleResponse;

export interface VehicleStatusSummary {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  maintenanceVehicles: number;
  outOfServiceVehicles: number;
}

export interface VehicleHistoryItemResponse {
  bookingId: string;
  bookingCode: string;
  startTime: string;
  expectedEndTime: string;
  actualEndTime?: string;
  status: string;
  renterId: string;
  checkedOutBy: string;
  checkedInBy?: string;
}

export interface DispatchableVehiclesParams {
  stationId: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
}

// Payment Types
export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  orderId?: string;
  payUrl?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
  ZALOPAY = 'ZALOPAY',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
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
