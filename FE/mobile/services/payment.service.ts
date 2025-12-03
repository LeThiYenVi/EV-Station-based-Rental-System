import api from "./api";
import { PaymentResponse } from "@/types";

export const paymentService = {
  /**
   * Get payment by ID
   * GET /api/payments/{paymentId}
   */
  getPaymentById: async (paymentId: string): Promise<PaymentResponse> => {
    return api.get(`/api/payments/${paymentId}`);
  },

  /**
   * Get all payments for a booking
   * GET /api/payments/booking/{bookingId}
   */
  getPaymentsByBooking: async (
    bookingId: string
  ): Promise<PaymentResponse[]> => {
    return api.get(`/api/payments/booking/${bookingId}`);
  },

  /**
   * Get payment by transaction ID
   * GET /api/payments/transaction/{transactionId}
   */
  getPaymentByTransactionId: async (
    transactionId: string
  ): Promise<PaymentResponse> => {
    return api.get(`/api/payments/transaction/${transactionId}`);
  },
};
