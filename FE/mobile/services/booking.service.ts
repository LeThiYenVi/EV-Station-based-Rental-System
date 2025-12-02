import api from "./api";
import {
  BookingResponse,
  BookingDetailResponse,
  CreateBookingRequest,
  BookingWithPaymentResponse,
} from "@/types";

/**
 * Booking Service
 * Handles all booking-related API calls
 */
export const bookingService = {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  createBooking: async (
    data: CreateBookingRequest
  ): Promise<BookingWithPaymentResponse> => {
    return api.post("/api/bookings", data);
  },

  /**
   * Get booking by ID
   * GET /api/bookings/{bookingId}
   */
  getBookingById: async (bookingId: string) => {
    return api.get<BookingDetailResponse>(`/api/bookings/${bookingId}`);
  },

  /**
   * Get booking by code
   * GET /api/bookings/code/{bookingCode}
   */
  getBookingByCode: async (bookingCode: string) => {
    return api.get<BookingDetailResponse>(`/api/bookings/code/${bookingCode}`);
  },

  /**
   * Get my bookings (current user's bookings)
   * GET /api/bookings/my-bookings
   */
  getMyBookings: async () => {
    return api.get<BookingResponse[]>("/api/bookings/my-bookings");
  },

  /**
   * Cancel a booking
   * PATCH /api/bookings/{bookingId}/cancel
   */
  cancelBooking: async (bookingId: string) => {
    return api.patch<BookingResponse>(`/api/bookings/${bookingId}/cancel`);
  },

  /**
   * Start a booking (for staff/admin or QR code unlock)
   * PATCH /api/bookings/{bookingId}/start
   */
  startBooking: async (bookingId: string) => {
    return api.patch<BookingResponse>(`/api/bookings/${bookingId}/start`);
  },

  /**
   * Complete a booking
   * PATCH /api/bookings/{bookingId}/complete
   */
  completeBooking: async (bookingId: string) => {
    return api.patch<BookingResponse>(`/api/bookings/${bookingId}/complete`);
  },
};
