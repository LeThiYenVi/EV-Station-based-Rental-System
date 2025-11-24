import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import type {
  PaymentResponse,
  MoMoCallbackRequest,
  PaymentStatus,
  PaymentMethod,
} from '../types/fleet-payment.types';

class PaymentService {
  /**
   * Process MoMo callback (webhook)
   * This is typically called by MoMo server, not by frontend
   */
  async processMoMoCallback(callback: MoMoCallbackRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PAYMENTS.MOMO_CALLBACK, callback);
  }

  /**
   * Get payment by ID
   * Requires: RENTER, ADMIN, or STAFF role
   */
  async getPaymentById(paymentId: string): Promise<PaymentResponse> {
    const url = API_ENDPOINTS.PAYMENTS.GET_BY_ID.replace(':paymentId', paymentId);
    const response = await apiClient.get<PaymentResponse>(url);
    return response.data!;
  }

  /**
   * Get all payments for a booking
   * Requires: RENTER, ADMIN, or STAFF role
   */
  async getPaymentsByBookingId(bookingId: string): Promise<PaymentResponse[]> {
    const url = API_ENDPOINTS.PAYMENTS.GET_BY_BOOKING.replace(':bookingId', bookingId);
    const response = await apiClient.get<PaymentResponse[]>(url);
    return response.data!;
  }

  /**
   * Get payment by transaction ID
   * Requires: RENTER, ADMIN, or STAFF role
   */
  async getPaymentByTransactionId(transactionId: string): Promise<PaymentResponse> {
    const url = API_ENDPOINTS.PAYMENTS.GET_BY_TRANSACTION.replace(':transactionId', transactionId);
    const response = await apiClient.get<PaymentResponse>(url);
    return response.data!;
  }

  /**
   * Check if payment is completed
   */
  isPaymentCompleted(payment: PaymentResponse): boolean {
    return payment.status === 'COMPLETED';
  }

  /**
   * Check if payment is pending
   */
  isPaymentPending(payment: PaymentResponse): boolean {
    return payment.status === 'PENDING' || payment.status === 'PROCESSING';
  }

  /**
   * Get payment status text in Vietnamese
   */
  getStatusText(status: PaymentStatus | string): string {
    const textMap: Record<string, string> = {
      PENDING: 'Chờ thanh toán',
      PROCESSING: 'Đang xử lý',
      COMPLETED: 'Đã thanh toán',
      FAILED: 'Thất bại',
      REFUNDED: 'Đã hoàn tiền',
      CANCELLED: 'Đã hủy',
    };
    return textMap[status] || status;
  }

  /**
   * Get payment status color for UI
   */
  getStatusColor(status: PaymentStatus | string): string {
    const colorMap: Record<string, string> = {
      PENDING: 'yellow',
      PROCESSING: 'blue',
      COMPLETED: 'green',
      FAILED: 'red',
      REFUNDED: 'orange',
      CANCELLED: 'gray',
    };
    return colorMap[status] || 'gray';
  }

  /**
   * Get payment method text in Vietnamese
   */
  getMethodText(method: PaymentMethod | string): string {
    const textMap: Record<string, string> = {
      MOMO: 'MoMo',
      VNPAY: 'VNPay',
      ZALOPAY: 'ZaloPay',
      CASH: 'Tiền mặt',
      BANK_TRANSFER: 'Chuyển khoản',
    };
    return textMap[method] || method;
  }

  /**
   * Format amount display
   */
  formatAmount(amount: number): string {
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  }

  /**
   * Format payment date
   */
  formatPaymentDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get payment method icon/logo URL
   */
  getMethodIcon(method: PaymentMethod | string): string {
    const iconMap: Record<string, string> = {
      MOMO: '/icons/momo.png',
      VNPAY: '/icons/vnpay.png',
      ZALOPAY: '/icons/zalopay.png',
      CASH: '/icons/cash.png',
      BANK_TRANSFER: '/icons/bank.png',
    };
    return iconMap[method] || '/icons/default-payment.png';
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
