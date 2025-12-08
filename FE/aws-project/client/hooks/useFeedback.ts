// ==========================================
// useFeedback Hook
// Manages feedback-related operations
// ==========================================

import { useState } from "react";
import feedbackService from "@/service/feedback/feedbackService";
import type {
  FeedbackResponse,
  FeedbackPageResponse,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackDetailResponse,
  FeedbackSummaryResponse,
  FeedbackStatisticsResponse,
  FeedbackAdminFilterParams,
} from "@/service/types/feedback.types";

export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // RENTER ENDPOINTS
  // ==========================================

  /**
   * Create a new feedback
   */
  const createFeedback = async (
    data: CreateFeedbackRequest,
  ): Promise<FeedbackResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.createFeedback(data);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create feedback";
      setError(errorMsg);
      console.error("createFeedback error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get feedback by ID
   */
  const getFeedbackById = async (
    feedbackId: string,
  ): Promise<FeedbackDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbackById(feedbackId);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch feedback";
      setError(errorMsg);
      console.error("getFeedbackById error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get feedback by booking ID
   */
  const getFeedbackByBookingId = async (
    bookingId: string,
  ): Promise<FeedbackDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbackByBookingId(bookingId);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch feedback";
      setError(errorMsg);
      console.error("getFeedbackByBookingId error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing feedback
   */
  const updateFeedback = async (
    feedbackId: string,
    data: UpdateFeedbackRequest,
  ): Promise<FeedbackResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.updateFeedback(feedbackId, data);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to update feedback";
      setError(errorMsg);
      console.error("updateFeedback error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get my feedbacks (current user)
   */
  const getMyFeedbacks = async (
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getMyFeedbacks(page, size);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch my feedbacks";
      setError(errorMsg);
      console.error("getMyFeedbacks error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADMIN/STAFF ENDPOINTS
  // ==========================================

  /**
   * Get all feedbacks with filters (Admin/Staff only)
   */
  const getAllFeedbacks = async (
    filters: FeedbackAdminFilterParams = {},
  ): Promise<FeedbackPageResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getAllFeedbacks(filters);
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch feedbacks";
      setError(errorMsg);
      console.error("getAllFeedbacks error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a feedback (Admin only)
   */
  const deleteFeedback = async (feedbackId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await feedbackService.deleteFeedback(feedbackId);
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete feedback";
      setError(errorMsg);
      console.error("deleteFeedback error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Respond to a feedback (Admin/Staff)
   */
  const respondToFeedback = async (
    feedbackId: string,
    response: string,
  ): Promise<FeedbackResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await feedbackService.respondToFeedback(
        feedbackId,
        response,
      );
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to respond to feedback";
      setError(errorMsg);
      console.error("respondToFeedback error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update response to a feedback (Admin/Staff)
   */
  const updateResponse = async (
    feedbackId: string,
    response: string,
  ): Promise<FeedbackResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await feedbackService.updateResponse(feedbackId, response);
      return result;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to update response";
      setError(errorMsg);
      console.error("updateResponse error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete response from a feedback (Admin/Staff)
   */
  const deleteResponse = async (feedbackId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await feedbackService.deleteResponse(feedbackId);
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete response";
      setError(errorMsg);
      console.error("deleteResponse error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get global feedback statistics (Admin/Staff)
   */
  const getStatistics = async (): Promise<FeedbackStatisticsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getStatistics();
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch statistics";
      setError(errorMsg);
      console.error("getStatistics error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  /**
   * Get feedbacks by vehicle ID
   */
  const getFeedbacksByVehicle = async (
    vehicleId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbacksByVehicle(
        vehicleId,
        page,
        size,
      );
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch vehicle feedbacks";
      setError(errorMsg);
      console.error("getFeedbacksByVehicle error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get vehicle feedback summary
   */
  const getVehicleFeedbackSummary = async (
    vehicleId: string,
    limit: number = 5,
  ): Promise<FeedbackSummaryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getVehicleFeedbackSummary(
        vehicleId,
        limit,
      );
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch vehicle summary";
      setError(errorMsg);
      console.error("getVehicleFeedbackSummary error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get feedbacks by station ID
   */
  const getFeedbacksByStation = async (
    stationId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<FeedbackPageResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getFeedbacksByStation(
        stationId,
        page,
        size,
      );
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch station feedbacks";
      setError(errorMsg);
      console.error("getFeedbacksByStation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get station feedback summary
   */
  const getStationFeedbackSummary = async (
    stationId: string,
    limit: number = 5,
  ): Promise<FeedbackSummaryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await feedbackService.getStationFeedbackSummary(
        stationId,
        limit,
      );
      return response;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch station summary";
      setError(errorMsg);
      console.error("getStationFeedbackSummary error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Renter
    createFeedback,
    getFeedbackById,
    getFeedbackByBookingId,
    updateFeedback,
    getMyFeedbacks,
    // Admin/Staff
    getAllFeedbacks,
    deleteFeedback,
    respondToFeedback,
    updateResponse,
    deleteResponse,
    getStatistics,
    // Public
    getFeedbacksByVehicle,
    getVehicleFeedbackSummary,
    getFeedbacksByStation,
    getStationFeedbackSummary,
  };
};
