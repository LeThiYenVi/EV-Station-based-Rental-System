package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.request.CreateFeedbackRequest;
import com.project.evrental.domain.dto.request.RespondFeedbackRequest;
import com.project.evrental.domain.dto.request.UpdateFeedbackRequest;
import com.project.evrental.domain.dto.response.*;
import com.project.evrental.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Feedback Management", description = "APIs for managing feedback and ratings")
public class FeedbackController {

    FeedbackService feedbackService;

    // ==================== RENTER ENDPOINTS ====================

    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    @Operation(summary = "Create feedback for a completed booking", description = "Renter creates feedback after completing a booking")
    public ResponseEntity<ApiResponse<FeedbackResponse>> createFeedback(
            @Valid @RequestBody CreateFeedbackRequest request
    ) {
        log.info("Request to create feedback for booking: {}", request.getBookingId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FeedbackResponse>builder()
                        .statusCode(201)
                        .message("Feedback created successfully")
                        .data(feedbackService.createFeedback(request))
                        .build());
    }

    @GetMapping("/{feedbackId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get feedback by ID", description = "View detailed feedback information")
    public ResponseEntity<ApiResponse<FeedbackDetailResponse>> getFeedbackById(
            @PathVariable UUID feedbackId
    ) {
        log.info("Request to get feedback detail: {}", feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackDetailResponse>builder()
                        .statusCode(200)
                        .data(feedbackService.getFeedbackById(feedbackId))
                        .build());
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get feedback by booking ID", description = "Retrieve feedback for a specific booking")
    public ResponseEntity<ApiResponse<FeedbackDetailResponse>> getFeedbackByBookingId(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to get feedback for booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackDetailResponse>builder()
                        .statusCode(200)
                        .data(feedbackService.getFeedbackByBookingId(bookingId))
                        .build());
    }

    @PutMapping("/{feedbackId}")
    @PreAuthorize("hasRole('RENTER')")
    @Operation(summary = "Update feedback", description = "Renter can edit their feedback within 7 days of creation")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(
            @PathVariable UUID feedbackId,
            @Valid @RequestBody UpdateFeedbackRequest request
    ) {
        log.info("Request to update feedback: {}", feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackResponse>builder()
                        .statusCode(200)
                        .message("Feedback updated successfully")
                        .data(feedbackService.updateFeedback(feedbackId, request))
                        .build());
    }

    @GetMapping("/my-feedbacks")
    @PreAuthorize("hasRole('RENTER')")
    @Operation(summary = "Get my feedbacks", description = "Renter views all their feedback history")
    public ResponseEntity<ApiResponse<Page<FeedbackResponse>>> getMyFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Request to get feedbacks for current renter - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<FeedbackResponse>>builder()
                        .statusCode(200)
                        .data(feedbackService.getMyFeedbacks(pageable))
                        .build());
    }

    // ==================== ADMIN/STAFF ENDPOINTS ====================

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all feedbacks with filters", description = "Admin/Staff view and filter all feedbacks")
    public ResponseEntity<ApiResponse<Page<FeedbackResponse>>> getAllFeedbacksWithFilters(
            @RequestParam(required = false) UUID stationId,
            @RequestParam(required = false) UUID vehicleId,
            @RequestParam(required = false) UUID renterId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Request to get all feedbacks with filters");
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<FeedbackResponse>>builder()
                        .statusCode(200)
                        .data(feedbackService.getAllFeedbacksWithFilters(
                                stationId, vehicleId, renterId,
                                fromDate, toDate, minRating, maxRating, pageable
                        ))
                        .build());
    }

    @PostMapping("/{feedbackId}/respond")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Respond to feedback", description = "Admin/Staff adds a response to feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> respondToFeedback(
            @PathVariable UUID feedbackId,
            @Valid @RequestBody RespondFeedbackRequest request
    ) {
        log.info("Request to respond to feedback: {}", feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackResponse>builder()
                        .statusCode(200)
                        .message("Response added successfully")
                        .data(feedbackService.respondToFeedback(feedbackId, request))
                        .build());
    }

    @PutMapping("/{feedbackId}/respond")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Update response", description = "Admin/Staff updates their response to feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateResponse(
            @PathVariable UUID feedbackId,
            @Valid @RequestBody RespondFeedbackRequest request
    ) {
        log.info("Request to update response for feedback: {}", feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackResponse>builder()
                        .statusCode(200)
                        .message("Response updated successfully")
                        .data(feedbackService.updateResponse(feedbackId, request))
                        .build());
    }

    @DeleteMapping("/{feedbackId}/respond")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Delete response", description = "Admin/Staff removes their response from feedback")
    public ResponseEntity<ApiResponse<?>> deleteResponse(
            @PathVariable UUID feedbackId
    ) {
        log.info("Request to delete response for feedback: {}", feedbackId);
        feedbackService.deleteResponse(feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(200)
                        .message("Response deleted successfully")
                        .build());
    }

    @DeleteMapping("/{feedbackId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete feedback", description = "Admin deletes a feedback")
    public ResponseEntity<ApiResponse<?>> deleteFeedback(
            @PathVariable UUID feedbackId
    ) {
        log.info("Request to delete feedback: {}", feedbackId);
        feedbackService.deleteFeedback(feedbackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(200)
                        .message("Feedback deleted successfully")
                        .build());
    }

    // ==================== PUBLIC ENDPOINTS ====================

    @GetMapping("/vehicle/{vehicleId}/summary")
    @Operation(summary = "Get vehicle feedback summary", description = "Public view of vehicle ratings and recent feedbacks")
    public ResponseEntity<ApiResponse<VehicleFeedbackSummaryResponse>> getVehicleFeedbackSummary(
            @PathVariable UUID vehicleId,
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Request to get feedback summary for vehicle: {}", vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleFeedbackSummaryResponse>builder()
                        .statusCode(200)
                        .data(feedbackService.getVehicleFeedbackSummary(vehicleId, limit))
                        .build());
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get vehicle feedbacks", description = "Public list of feedbacks for a vehicle")
    public ResponseEntity<ApiResponse<Page<FeedbackResponse>>> getPublicVehicleFeedbacks(
            @PathVariable UUID vehicleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Request to get public feedbacks for vehicle: {}", vehicleId);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<FeedbackResponse>>builder()
                        .statusCode(200)
                        .data(feedbackService.getPublicVehicleFeedbacks(vehicleId, pageable))
                        .build());
    }

    @GetMapping("/station/{stationId}/summary")
    @Operation(summary = "Get station feedback summary", description = "Public view of station ratings and recent feedbacks")
    public ResponseEntity<ApiResponse<StationFeedbackSummaryResponse>> getStationFeedbackSummary(
            @PathVariable UUID stationId,
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Request to get feedback summary for station: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StationFeedbackSummaryResponse>builder()
                        .statusCode(200)
                        .data(feedbackService.getStationFeedbackSummary(stationId, limit))
                        .build());
    }

    @GetMapping("/station/{stationId}")
    @Operation(summary = "Get station feedbacks", description = "Public list of feedbacks for a station")
    public ResponseEntity<ApiResponse<Page<FeedbackResponse>>> getPublicStationFeedbacks(
            @PathVariable UUID stationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Request to get public feedbacks for station: {}", stationId);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<FeedbackResponse>>builder()
                        .statusCode(200)
                        .data(feedbackService.getPublicStationFeedbacks(stationId, pageable))
                        .build());
    }

    // ==================== STATISTICS ENDPOINTS ====================

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get global feedback statistics", description = "Admin views comprehensive feedback analytics")
    public ResponseEntity<ApiResponse<FeedbackStatisticsResponse>> getGlobalStatistics() {
        log.info("Request to get global feedback statistics");
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<FeedbackStatisticsResponse>builder()
                        .statusCode(200)
                        .data(feedbackService.getGlobalStatistics())
                        .build());
    }
}
