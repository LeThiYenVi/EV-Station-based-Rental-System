import { apiClient } from "../api/apiClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingResponse,
  BookingDetailResponse,
  BookingWithPaymentResponse,
  MomoPaymentResponse,
  PageResponse,
  BookingQueryParams,
} from "../types/booking.types";
import { BookingStatus } from "../types/enums";

class BookingService {
  /**
   * Create a new booking
   * Requires: RENTER role
   */
  async createBooking(
    data: CreateBookingRequest,
  ): Promise<BookingWithPaymentResponse> {
    const response = await apiClient.post<BookingWithPaymentResponse>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      data,
    );
    return response.data!;
  }

  /**
   * Get booking by ID
   * Requires: RENTER, STAFF, or ADMIN role
   */
  async getBookingById(bookingId: string): Promise<BookingDetailResponse> {
    const url = API_ENDPOINTS.BOOKINGS.GET_BY_ID.replace(":id", bookingId);
    const response = await apiClient.get<BookingDetailResponse>(url);
    return response.data!;
  }

  /**
   * Get booking by booking code
   * Requires: RENTER, STAFF, or ADMIN role
   */
  async getBookingByCode(bookingCode: string): Promise<BookingDetailResponse> {
    const url = API_ENDPOINTS.BOOKINGS.GET_BY_CODE.replace(
      ":code",
      bookingCode,
    );
    const response = await apiClient.get<BookingDetailResponse>(url);
    return response.data!;
  }

  /**
   * Get all bookings (paginated)
   * Requires: STAFF or ADMIN role
   */
  async getAllBookings(
    params?: BookingQueryParams,
  ): Promise<PageResponse<BookingResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortDirection)
      queryParams.append("sortDirection", params.sortDirection);

    const url = `${API_ENDPOINTS.BOOKINGS.GET_ALL}?${queryParams.toString()}`;
    const response = await apiClient.get<PageResponse<BookingResponse>>(url);
    return response.data!;
  }

  /**
   * Get current user's bookings
   * Requires: RENTER role
   */
  async getMyBookings(): Promise<BookingResponse[]> {
    const response = await apiClient.get<BookingResponse[]>(
      API_ENDPOINTS.BOOKINGS.GET_MY_BOOKINGS,
    );
    return response.data!;
  }

  /**
   * Get bookings by status
   * Requires: STAFF or ADMIN role
   */
  async getBookingsByStatus(status: BookingStatus): Promise<BookingResponse[]> {
    const url = API_ENDPOINTS.BOOKINGS.GET_BY_STATUS.replace(":status", status);
    const response = await apiClient.get<BookingResponse[]>(url);
    return response.data!;
  }

  /**
   * Get bookings by vehicle ID
   * Requires: STAFF or ADMIN role
   */
  async getBookingsByVehicleId(vehicleId: string): Promise<BookingResponse[]> {
    const url = API_ENDPOINTS.BOOKINGS.GET_BY_VEHICLE.replace(
      ":vehicleId",
      vehicleId,
    );
    const response = await apiClient.get<BookingResponse[]>(url);
    return response.data!;
  }

  /**
   * Get bookings by station ID
   * Requires: STAFF or ADMIN role
   */
  async getBookingsByStationId(stationId: string): Promise<BookingResponse[]> {
    const url = API_ENDPOINTS.BOOKINGS.GET_BY_STATION.replace(
      ":stationId",
      stationId,
    );
    const response = await apiClient.get<BookingResponse[]>(url);
    return response.data!;
  }

  /**
   * Update booking
   * Requires: STAFF or ADMIN role
   */
  async updateBooking(
    bookingId: string,
    data: UpdateBookingRequest,
  ): Promise<BookingResponse> {
    const url = API_ENDPOINTS.BOOKINGS.UPDATE.replace(":id", bookingId);
    const response = await apiClient.put<BookingResponse>(url, data);
    return response.data!;
  }

  /**
   * Confirm booking
   * Requires: STAFF or ADMIN role
   */
  async confirmBooking(bookingId: string): Promise<BookingResponse> {
    const url = API_ENDPOINTS.BOOKINGS.CONFIRM.replace(":id", bookingId);
    const response = await apiClient.patch<BookingResponse>(url);
    return response.data!;
  }

  /**
   * Start booking
   * Requires: STAFF or ADMIN role
   */
  async startBooking(bookingId: string): Promise<BookingResponse> {
    const url = API_ENDPOINTS.BOOKINGS.START.replace(":id", bookingId);
    const response = await apiClient.patch<BookingResponse>(url);
    return response.data!;
  }

  /**
   * Complete booking
   * Requires: STAFF or ADMIN role
   */
  async completeBooking(bookingId: string): Promise<BookingResponse> {
    const url = API_ENDPOINTS.BOOKINGS.COMPLETE.replace(":id", bookingId);
    const response = await apiClient.patch<BookingResponse>(url);
    return response.data!;
  }

  /**
   * Cancel booking
   * Requires: RENTER, STAFF, or ADMIN role
   */
  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    const url = API_ENDPOINTS.BOOKINGS.CANCEL.replace(":id", bookingId);
    const response = await apiClient.patch<BookingResponse>(url);
    return response.data!;
  }

  /**
   * Delete booking
   * Requires: ADMIN role
   */
  async deleteBooking(bookingId: string): Promise<void> {
    const url = API_ENDPOINTS.BOOKINGS.DELETE.replace(":id", bookingId);
    await apiClient.delete(url);
  }

  /**
   * Pay remainder amount for completed booking
   * Requires: RENTER role
   * Returns MomoPaymentResponse with payUrl
   */
  async payRemainder(bookingId: string): Promise<MomoPaymentResponse> {
    const url = API_ENDPOINTS.BOOKINGS.PAY_REMAINDER.replace(":id", bookingId);
    const response = await apiClient.get<MomoPaymentResponse>(url);
    return response.data!;
  }

  /**
   * Check if booking can be cancelled
   */
  canCancelBooking(booking: BookingResponse): boolean {
    return (
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED
    );
  }

  /**
   * Get booking status display text
   */
  getStatusText(status: BookingStatus): string {
    const statusMap: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "Chờ xác nhận",
      [BookingStatus.CONFIRMED]: "Đã xác nhận",
      [BookingStatus.ONGOING]: "Đang diễn ra",
      [BookingStatus.COMPLETED]: "Hoàn thành",
      [BookingStatus.CANCELLED]: "Đã hủy",
    };
    return statusMap[status] || String(status);
  }

  /**
   * Get booking status color for UI
   */
  getStatusColor(status: BookingStatus): string {
    const colorMap: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "yellow",
      [BookingStatus.CONFIRMED]: "blue",
      [BookingStatus.ONGOING]: "green",
      [BookingStatus.COMPLETED]: "gray",
      [BookingStatus.CANCELLED]: "red",
    };
    return colorMap[status] || "gray";
  }

  /**
   * Calculate total rental days
   */
  calculateRentalDays(pickupTime: string, returnTime: string): number {
    const pickup = new Date(pickupTime);
    const returnDate = new Date(returnTime);
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Format booking date for display
   */
  formatBookingDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;
