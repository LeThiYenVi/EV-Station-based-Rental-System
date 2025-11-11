import { useState, useCallback } from 'react';
import { paymentService } from '@/service';
import type { PaymentResponse } from '@/service';

interface UsePaymentReturn {
  // State
  loading: boolean;
  error: string | null;

  // Methods
  getPaymentById: (paymentId: string) => Promise<PaymentResponse | null>;
  getPaymentsByBookingId: (bookingId: string) => Promise<PaymentResponse[] | null>;
  getPaymentByTransactionId: (transactionId: string) => Promise<PaymentResponse | null>;

  // Helpers
  clearError: () => void;
}

/**
 * Custom hook for payment operations
 * 
 * Usage:
 * ```tsx
 * const { getPaymentById, getPaymentsByBookingId, loading } = usePayment();
 * 
 * const payment = await getPaymentById(paymentId);
 * const payments = await getPaymentsByBookingId(bookingId);
 * ```
 */
export const usePayment = (): UsePaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getPaymentById = useCallback(
    async (paymentId: string): Promise<PaymentResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.getPaymentById(paymentId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get payment';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPaymentsByBookingId = useCallback(
    async (bookingId: string): Promise<PaymentResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.getPaymentsByBookingId(bookingId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get payments';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPaymentByTransactionId = useCallback(
    async (transactionId: string): Promise<PaymentResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.getPaymentByTransactionId(transactionId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get payment';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getPaymentById,
    getPaymentsByBookingId,
    getPaymentByTransactionId,
    clearError,
  };
};

export default usePayment;
