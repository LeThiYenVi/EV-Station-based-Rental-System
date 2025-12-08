// ==========================================
// Feedback Service
// Handles feedback operations
// ==========================================

import axios from "axios";
import apiClient from "../api/apiClient";
import type {
  FeedbackResponse,
  FeedbackPageResponse,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  RespondFeedbackRequest,
  FeedbackDetailResponse,
  FeedbackSummaryResponse,
  FeedbackStatisticsResponse,
  FeedbackAdminFilterParams,
} from "../types/feedback.types";

// API Endpoints for feedbacks
const FEEDBACK_ENDPOINTS = {
  // Renter endpoints
  CREATE: "/feedbacks",
  GET_BY_ID: "/feedbacks/:feedbackId",
  GET_BY_BOOKING: "/feedbacks/booking/:bookingId",
  UPDATE: "/feedbacks/:feedbackId",
  GET_MY_FEEDBACKS: "/feedbacks/my-feedbacks",

  // Admin/Staff endpoints
  GET_ALL_ADMIN: "/feedbacks/admin/all",
  DELETE: "/feedbacks/:feedbackId",
  RESPOND: "/feedbacks/:feedbackId/respond",
  UPDATE_RESPONSE: "/feedbacks/:feedbackId/respond",
  DELETE_RESPONSE: "/feedbacks/:feedbackId/respond",
  STATISTICS: "/feedbacks/statistics",

  // Public endpoints
  GET_BY_VEHICLE: "/feedbacks/vehicle/:vehicleId",
  GET_VEHICLE_SUMMARY: "/feedbacks/vehicle/:vehicleId/summary",
  GET_BY_STATION: "/feedbacks/station/:stationId",
  GET_STATION_SUMMARY: "/feedbacks/station/:stationId/summary",
};

// Create a dedicated axios instance for feedback API that uses idToken
const feedbackApiClient = axios.create({
  baseURL: "/api", // Use Vite proxy
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add idToken instead of accessToken
feedbackApiClient.interceptors.request.use(
  (config) => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    console.log("Feedback API request with idToken:", {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
feedbackApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Feedback API error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

class FeedbackService {
  // ==========================================
  // RENTER ENDPOINTS
  // ==========================================

  /**
   * Create a new feedback
   * POST /api/feedbacks
   * @param data - Feedback creation data
   * @returns Created feedback response
   */
  async createFeedback(data: CreateFeedbackRequest): Promise<FeedbackResponse> {
    const response = await feedbackApiClient.post(
      FEEDBACK_ENDPOINTS.CREATE,
      data,
    );
    return response.data?.data || response.data;
  }

  /**
   * Get feedback by ID
   * GET /api/feedbacks/:feedbackId
   * @param feedbackId - Feedback UUID
   * @returns Detailed feedback response
   */
  async getFeedbackById(feedbackId: string): Promise<FeedbackDetailResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_BY_ID.replace(":feedbackId", feedbackId);
    const response = await feedbackApiClient.get(url);
    return response.data?.data || response.data;
  }

  /**
   * Get feedback by booking ID
   * GET /api/feedbacks/booking/:bookingId
   * @param bookingId - Booking UUID
   * @returns Detailed feedback response
   */
  async getFeedbackByBookingId(
    bookingId: string,
  ): Promise<FeedbackDetailResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_BY_BOOKING.replace(
      ":bookingId",
      bookingId,
    );
    const response = await feedbackApiClient.get(url);
    return response.data?.data || response.data;
  }

  /**
   * Update an existing feedback
   * PUT /api/feedbacks/:feedbackId
   * @param feedbackId - Feedback UUID
   * @param data - Feedback update data
   * @returns Updated feedback response
   */
  async updateFeedback(
    feedbackId: string,
    data: UpdateFeedbackRequest,
  ): Promise<FeedbackResponse> {
    const url = FEEDBACK_ENDPOINTS.UPDATE.replace(":feedbackId", feedbackId);
    const response = await feedbackApiClient.put(url, data);
    return response.data?.data || response.data;
  }

  /**
   * Get my feedbacks (current user's feedbacks)
   * GET /api/feedbacks/my-feedbacks
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated feedback list
   */
  async getMyFeedbacks(
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await feedbackApiClient.get(
      `${FEEDBACK_ENDPOINTS.GET_MY_FEEDBACKS}?${params.toString()}`,
    );
    return response.data?.data || response.data;
  }

  // ==========================================
  // ADMIN/STAFF ENDPOINTS
  // ==========================================

  /**
   * Get all feedbacks with filters (Admin/Staff only)
   * GET /api/feedbacks/admin/all
   * @param filters - Filter parameters
   * @returns Paginated feedback list
   */
  async getAllFeedbacks(
    filters: FeedbackAdminFilterParams = {},
  ): Promise<FeedbackPageResponse> {
    const params = new URLSearchParams();

    if (filters.stationId) params.append("stationId", filters.stationId);
    if (filters.vehicleId) params.append("vehicleId", filters.vehicleId);
    if (filters.renterId) params.append("renterId", filters.renterId);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.minRating !== undefined)
      params.append("minRating", filters.minRating.toString());
    if (filters.maxRating !== undefined)
      params.append("maxRating", filters.maxRating.toString());

    params.append("page", (filters.page ?? 0).toString());
    params.append("size", (filters.size ?? 10).toString());

    const response = await feedbackApiClient.get(
      `${FEEDBACK_ENDPOINTS.GET_ALL_ADMIN}?${params.toString()}`,
    );
    return response.data?.data || response.data;
  }

  /**
   * Delete a feedback (Admin only)
   * DELETE /api/feedbacks/:feedbackId
   * @param feedbackId - Feedback UUID
   */
  async deleteFeedback(feedbackId: string): Promise<void> {
    const url = FEEDBACK_ENDPOINTS.DELETE.replace(":feedbackId", feedbackId);
    await feedbackApiClient.delete(url);
  }

  /**
   * Respond to a feedback (Admin/Staff)
   * POST /api/feedbacks/:feedbackId/respond
   * @param feedbackId - Feedback UUID
   * @param responseText - Response message
   * @returns Updated feedback response
   */
  async respondToFeedback(
    feedbackId: string,
    responseText: string,
  ): Promise<FeedbackResponse> {
    const url = FEEDBACK_ENDPOINTS.RESPOND.replace(":feedbackId", feedbackId);
    const response = await feedbackApiClient.post(url, {
      response: responseText,
    });
    return response.data?.data || response.data;
  }

  /**
   * Update response to a feedback (Admin/Staff)
   * PUT /api/feedbacks/:feedbackId/respond
   * @param feedbackId - Feedback UUID
   * @param responseText - Updated response message
   * @returns Updated feedback response
   */
  async updateResponse(
    feedbackId: string,
    responseText: string,
  ): Promise<FeedbackResponse> {
    const url = FEEDBACK_ENDPOINTS.UPDATE_RESPONSE.replace(
      ":feedbackId",
      feedbackId,
    );
    const response = await feedbackApiClient.put(url, {
      response: responseText,
    });
    return response.data?.data || response.data;
  }

  /**
   * Delete response from a feedback (Admin/Staff)
   * DELETE /api/feedbacks/:feedbackId/respond
   * @param feedbackId - Feedback UUID
   */
  async deleteResponse(feedbackId: string): Promise<void> {
    const url = FEEDBACK_ENDPOINTS.DELETE_RESPONSE.replace(
      ":feedbackId",
      feedbackId,
    );
    await feedbackApiClient.delete(url);
  }

  /**
   * Get global feedback statistics (Admin/Staff)
   * GET /api/feedbacks/statistics
   * @returns Feedback statistics
   */
  async getStatistics(): Promise<FeedbackStatisticsResponse> {
    const response = await feedbackApiClient.get(FEEDBACK_ENDPOINTS.STATISTICS);
    return response.data?.data || response.data;
  }

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  /**
   * Get feedbacks by vehicle ID with pagination (Public)
   * GET /api/feedbacks/vehicle/:vehicleId
   * @param vehicleId - Vehicle UUID
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated feedback list
   */
  async getFeedbacksByVehicle(
    vehicleId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_BY_VEHICLE.replace(
      ":vehicleId",
      vehicleId,
    );
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await feedbackApiClient.get(`${url}?${params.toString()}`);
    return response.data?.data || response.data;
  }

  /**
   * Get vehicle feedback summary (Public)
   * GET /api/feedbacks/vehicle/:vehicleId/summary
   * @param vehicleId - Vehicle UUID
   * @param limit - Number of recent feedbacks to include (default 5)
   * @returns Vehicle feedback summary
   */
  async getVehicleFeedbackSummary(
    vehicleId: string,
    limit: number = 5,
  ): Promise<FeedbackSummaryResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_VEHICLE_SUMMARY.replace(
      ":vehicleId",
      vehicleId,
    );
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await feedbackApiClient.get(`${url}?${params.toString()}`);
    return response.data?.data || response.data;
  }

  /**
   * Get feedbacks by station ID with pagination (Public)
   * GET /api/feedbacks/station/:stationId
   * @param stationId - Station UUID
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated feedback list
   */
  async getFeedbacksByStation(
    stationId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_BY_STATION.replace(
      ":stationId",
      stationId,
    );
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await feedbackApiClient.get(`${url}?${params.toString()}`);
    return response.data?.data || response.data;
  }

  /**
   * Get station feedback summary (Public)
   * GET /api/feedbacks/station/:stationId/summary
   * @param stationId - Station UUID
   * @param limit - Number of recent feedbacks to include (default 5)
   * @returns Station feedback summary
   */
  async getStationFeedbackSummary(
    stationId: string,
    limit: number = 5,
  ): Promise<FeedbackSummaryResponse> {
    const url = FEEDBACK_ENDPOINTS.GET_STATION_SUMMARY.replace(
      ":stationId",
      stationId,
    );
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await feedbackApiClient.get(`${url}?${params.toString()}`);
    return response.data?.data || response.data;
  }
}

// Export singleton instance
const feedbackService = new FeedbackService();
export default feedbackService;
