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
} from "../types/feedback.types";

// API Endpoints for feedbacks
const FEEDBACK_ENDPOINTS = {
  CREATE: "/feedbacks",
  GET_BY_VEHICLE: "/feedbacks/vehicle/:vehicleId",
  GET_MY_FEEDBACKS: "/feedbacks/my-feedbacks",
  UPDATE: "/feedbacks/:feedbackId",
  DELETE: "/feedbacks/:feedbackId",
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
  }
);

// Response interceptor for error handling
feedbackApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Feedback API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class FeedbackService {
  /**
   * Create a new feedback
   * @param data - Feedback creation data
   * @returns Created feedback response
   */
  async createFeedback(
    data: CreateFeedbackRequest,
  ): Promise<FeedbackResponse> {
    const response = await feedbackApiClient.post(FEEDBACK_ENDPOINTS.CREATE, data);
    return response.data?.data || response.data;
  }

  /**
   * Get feedbacks by vehicle ID with pagination
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
   * Get my feedbacks (current user's feedbacks)
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
      `${FEEDBACK_ENDPOINTS.GET_MY_FEEDBACKS}?${params.toString()}`
    );
    return response.data?.data || response.data;
  }

  /**
   * Update an existing feedback
   * @param feedbackId - Feedback UUID
   * @param data - Feedback update data
   * @returns Updated feedback response
   */
  async updateFeedback(
    feedbackId: string,
    data: {
      vehicleRating?: number;
      stationRating?: number;
      comment?: string;
    },
  ): Promise<FeedbackResponse> {
    const url = FEEDBACK_ENDPOINTS.UPDATE.replace(":feedbackId", feedbackId);
    const response = await feedbackApiClient.put(url, data);
    return response.data?.data || response.data;
  }

  /**
   * Delete a feedback
   * @param feedbackId - Feedback UUID
   */
  async deleteFeedback(feedbackId: string): Promise<void> {
    const url = FEEDBACK_ENDPOINTS.DELETE.replace(":feedbackId", feedbackId);
    await feedbackApiClient.delete(url);
  }
}

// Export singleton instance
const feedbackService = new FeedbackService();
export default feedbackService;
