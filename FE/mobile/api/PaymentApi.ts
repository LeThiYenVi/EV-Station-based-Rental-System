import apiClient from "./apiClient";
import { PaymentResponse } from "@/types";

/**
 * Payment API Service
 * Handles all payment-related API calls
 * Note: Payment creation is handled through booking creation
 */
export const PaymentApi = {
  /**
   * Get payment by ID (RENTER, STAFF, ADMIN)
   */
  async getPaymentById(paymentId: string): Promise<PaymentResponse> {
    const response = await apiClient.get<{ data: PaymentResponse }>(
      `/api/payments/${paymentId}`
    );
    return response.data.data;
  },

  /**
   * Get all payments for a booking (RENTER, STAFF, ADMIN)
   */
  async getPaymentsByBooking(bookingId: string): Promise<PaymentResponse[]> {
    const response = await apiClient.get<{ data: PaymentResponse[] }>(
      `/api/payments/booking/${bookingId}`
    );
    return response.data.data;
  },

  /**
   * Get payment by transaction ID (RENTER, STAFF, ADMIN)
   */
  async getPaymentByTransactionId(
    transactionId: string
  ): Promise<PaymentResponse> {
    const response = await apiClient.get<{ data: PaymentResponse }>(
      `/api/payments/transaction/${transactionId}`
    );
    return response.data.data;
  },

  /**
   * Get user's payment history
   * Client-side aggregation of payments from bookings
   */
  async getMyPayments(bookingIds: string[]): Promise<PaymentResponse[]> {
    const paymentPromises = bookingIds.map((id) =>
      this.getPaymentsByBooking(id)
    );
    const paymentArrays = await Promise.all(paymentPromises);
    return paymentArrays.flat();
  },
};
