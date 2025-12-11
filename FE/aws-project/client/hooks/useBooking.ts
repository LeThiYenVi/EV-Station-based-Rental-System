import { useState, useCallback } from 'react';
import { bookingService } from '@/service';
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingResponse,
  BookingDetailResponse,
  BookingWithPaymentResponse,
  MomoPaymentResponse,
  PageResponse,
  BookingQueryParams,
  BookingStatus,
} from '@/service';

interface UseBookingReturn {
  // State
  loading: boolean;
  error: string | null;

  // Methods
  createBooking: (data: CreateBookingRequest) => Promise<BookingWithPaymentResponse | null>;
  getBookingById: (id: string) => Promise<BookingDetailResponse | null>;
  getBookingByCode: (code: string) => Promise<BookingDetailResponse | null>;
  getAllBookings: (params?: BookingQueryParams) => Promise<PageResponse<BookingResponse> | null>;
  getMyBookings: () => Promise<BookingResponse[] | null>;
  getBookingsByStatus: (status: BookingStatus) => Promise<BookingResponse[] | null>;
  getBookingsByVehicleId: (vehicleId: string) => Promise<BookingResponse[] | null>;
  getBookingsByStationId: (stationId: string) => Promise<BookingResponse[] | null>;
  updateBooking: (id: string, data: UpdateBookingRequest) => Promise<BookingResponse | null>;
  confirmBooking: (id: string) => Promise<BookingResponse | null>;
  startBooking: (id: string) => Promise<BookingResponse | null>;
  completeBooking: (id: string) => Promise<BookingWithPaymentResponse | null>;
  cancelBooking: (id: string) => Promise<BookingResponse | null>;
  deleteBooking: (id: string) => Promise<boolean>;
  payRemainder: (id: string) => Promise<MomoPaymentResponse | null>;

  // Helpers
  clearError: () => void;
}

/**
 * Custom hook for booking operations
 * 
 * Usage:
 * ```tsx
 * const { createBooking, getMyBookings, loading, error } = useBooking();
 * 
 * const handleCreateBooking = async () => {
 *   const result = await createBooking(bookingData);
 *   if (result) {
 *     // Success - redirect to payment if paymentUrl exists
 *     if (result.paymentUrl) {
 *       window.location.href = result.paymentUrl;
 *     }
 *   }
 * };
 * ```
 */
export const useBooking = (): UseBookingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createBooking = useCallback(
    async (data: CreateBookingRequest): Promise<BookingWithPaymentResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.createBooking(data);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create booking';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBookingById = useCallback(
    async (id: string): Promise<BookingDetailResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getBookingById(id);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get booking';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBookingByCode = useCallback(
    async (code: string): Promise<BookingDetailResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getBookingByCode(code);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get booking';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAllBookings = useCallback(
    async (params?: BookingQueryParams): Promise<PageResponse<BookingResponse> | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getAllBookings(params);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get bookings';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMyBookings = useCallback(async (): Promise<BookingResponse[] | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getMyBookings();
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get your bookings';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingsByStatus = useCallback(
    async (status: BookingStatus): Promise<BookingResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getBookingsByStatus(status);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get bookings';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBookingsByVehicleId = useCallback(
    async (vehicleId: string): Promise<BookingResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getBookingsByVehicleId(vehicleId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get bookings';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBookingsByStationId = useCallback(
    async (stationId: string): Promise<BookingResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.getBookingsByStationId(stationId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get bookings';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBooking = useCallback(
    async (id: string, data: UpdateBookingRequest): Promise<BookingResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingService.updateBooking(id, data);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update booking';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const confirmBooking = useCallback(async (id: string): Promise<BookingResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.confirmBooking(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to confirm booking';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startBooking = useCallback(async (id: string): Promise<BookingResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.startBooking(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to start booking';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeBooking = useCallback(async (id: string): Promise<BookingWithPaymentResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.completeBooking(id);
      return response as BookingWithPaymentResponse;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to complete booking';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id: string): Promise<BookingResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.cancelBooking(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await bookingService.deleteBooking(id);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete booking';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const payRemainder = useCallback(async (id: string): Promise<MomoPaymentResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.payRemainder(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to process payment';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  return {
    loading,
    error,
    createBooking,
    getBookingById,
    getBookingByCode,
    getAllBookings,
    getMyBookings,
    getBookingsByStatus,
    getBookingsByVehicleId,
    getBookingsByStationId,
    updateBooking,
    confirmBooking,
    startBooking,
    completeBooking,
    cancelBooking,
    deleteBooking,
    payRemainder,
    clearError,
  };
};

export default useBooking;
