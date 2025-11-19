import apiClient from "./apiClient";
import {
  BookingResponse,
  BookingDetailResponse,
  BookingWithPaymentResponse,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingStatus,
  BookingFilterParams,
  Page,
} from "@/types";

/**
 * Booking API Service
 * Handles all booking-related API calls
 * Supports both RENTER and STAFF roles
 */
export const BookingApi = {
  // ==================== RENTER ENDPOINTS ====================

  /**
   * Create a new booking (RENTER only)
   * Returns booking with payment information
   */
  async createBooking(
    data: CreateBookingRequest
  ): Promise<BookingWithPaymentResponse> {
    const response = await apiClient.post<{ data: BookingWithPaymentResponse }>(
      "/api/bookings",
      data
    );
    return response.data.data;
  },

  /**
   * Get booking by ID (RENTER, STAFF, ADMIN)
   */
  async getBookingById(bookingId: string): Promise<BookingDetailResponse> {
    const response = await apiClient.get<{ data: BookingDetailResponse }>(
      `/api/bookings/${bookingId}`
    );
    return response.data.data;
  },

  /**
   * Get booking by booking code (RENTER, STAFF, ADMIN)
   */
  async getBookingByCode(bookingCode: string): Promise<BookingDetailResponse> {
    const response = await apiClient.get<{ data: BookingDetailResponse }>(
      `/api/bookings/code/${bookingCode}`
    );
    return response.data.data;
  },

  /**
   * Get current user's bookings (RENTER only)
   */
  async getMyBookings(): Promise<BookingResponse[]> {
    const response = await apiClient.get<{ data: BookingResponse[] }>(
      "/api/bookings/my-bookings"
    );
    return response.data.data;
  },

  /**
   * Cancel a booking (RENTER, STAFF, ADMIN)
   */
  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    const response = await apiClient.patch<{ data: BookingResponse }>(
      `/api/bookings/${bookingId}/cancel`
    );
    return response.data.data;
  },

  // ==================== STAFF ENDPOINTS ====================

  /**
   * Get all bookings with pagination (STAFF, ADMIN)
   */
  async getAllBookings(
    params?: BookingFilterParams
  ): Promise<Page<BookingResponse>> {
    const response = await apiClient.get<{ data: Page<BookingResponse> }>(
      "/api/bookings",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get bookings by status (STAFF, ADMIN)
   */
  async getBookingsByStatus(status: BookingStatus): Promise<BookingResponse[]> {
    const response = await apiClient.get<{ data: BookingResponse[] }>(
      `/api/bookings/status/${status}`
    );
    return response.data.data;
  },

  /**
   * Get bookings by vehicle (STAFF, ADMIN)
   */
  async getBookingsByVehicle(vehicleId: string): Promise<BookingResponse[]> {
    const response = await apiClient.get<{ data: BookingResponse[] }>(
      `/api/bookings/vehicle/${vehicleId}`
    );
    return response.data.data;
  },

  /**
   * Get bookings by station (STAFF, ADMIN)
   */
  async getBookingsByStation(stationId: string): Promise<BookingResponse[]> {
    const response = await apiClient.get<{ data: BookingResponse[] }>(
      `/api/bookings/station/${stationId}`
    );
    return response.data.data;
  },

  /**
   * Update booking (STAFF, ADMIN)
   */
  async updateBooking(
    bookingId: string,
    data: UpdateBookingRequest
  ): Promise<BookingResponse> {
    const response = await apiClient.put<{ data: BookingResponse }>(
      `/api/bookings/${bookingId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Confirm booking (STAFF, ADMIN)
   */
  async confirmBooking(bookingId: string): Promise<BookingResponse> {
    const response = await apiClient.patch<{ data: BookingResponse }>(
      `/api/bookings/${bookingId}/confirm`
    );
    return response.data.data;
  },

  /**
   * Start booking (STAFF, ADMIN)
   * Called when customer picks up the vehicle
   */
  async startBooking(bookingId: string): Promise<BookingResponse> {
    const response = await apiClient.patch<{ data: BookingResponse }>(
      `/api/bookings/${bookingId}/start`
    );
    return response.data.data;
  },

  /**
   * Complete booking (STAFF, ADMIN)
   * Called when customer returns the vehicle
   */
  async completeBooking(bookingId: string): Promise<BookingResponse> {
    const response = await apiClient.patch<{ data: BookingResponse }>(
      `/api/bookings/${bookingId}/complete`
    );
    return response.data.data;
  },

  // ==================== UTILITY METHODS ====================

  /**
   * Get user's bookings filtered by status
   */
  async getMyBookingsByStatus(
    status: BookingStatus
  ): Promise<BookingResponse[]> {
    const allBookings = await this.getMyBookings();
    return allBookings.filter((booking) => booking.status === status);
  },

  /**
   * Get active bookings for current user
   * (PENDING, CONFIRMED, STARTED)
   */
  async getMyActiveBookings(): Promise<BookingResponse[]> {
    const allBookings = await this.getMyBookings();
    const activeStatuses: BookingStatus[] = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.STARTED,
    ];
    return allBookings.filter((booking) =>
      activeStatuses.includes(booking.status)
    );
  },

  /**
   * Get completed bookings for current user
   */
  async getMyCompletedBookings(): Promise<BookingResponse[]> {
    return this.getMyBookingsByStatus(BookingStatus.COMPLETED);
  },

  /**
   * Get cancelled bookings for current user
   */
  async getMyCancelledBookings(): Promise<BookingResponse[]> {
    return this.getMyBookingsByStatus(BookingStatus.CANCELLED);
  },

  /**
   * Check if booking can be cancelled
   */
  canCancelBooking(booking: BookingResponse): boolean {
    return (
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED
    );
  },

  /**
   * Calculate booking duration in hours
   */
  calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60)); // Convert to hours
  },
};
