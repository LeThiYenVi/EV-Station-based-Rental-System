import { PaymentMethod, PaymentStatus } from "./Enums";

// Payment Response Types
export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  paidAt?: string;
  createdAt: string;
}

// MoMo Payment Types
export interface MoMoCallbackRequest {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: string;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

export interface MoMoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: string;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}
