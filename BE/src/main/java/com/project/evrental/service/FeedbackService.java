package com.project.evrental.service;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.dto.request.CreateFeedbackRequest;
import com.project.evrental.domain.dto.request.RespondFeedbackRequest;
import com.project.evrental.domain.dto.request.UpdateFeedbackRequest;
import com.project.evrental.domain.dto.response.*;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.Feedback;
import com.project.evrental.domain.entity.User;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.FeedbackMapper;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.FeedbackRepository;
import com.project.evrental.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {

    FeedbackRepository feedbackRepository;
    BookingRepository bookingRepository;
    UserRepository userRepository;

    private static final int EDIT_ALLOWED_DAYS = 7;

    // ==================== RENTER USE CASES ====================

    @Transactional
    public FeedbackResponse createFeedback(CreateFeedbackRequest request) {
        log.info("Creating feedback for booking: {}", request.getBookingId());

        String sub = getCognitoSubFromAuthentication();
        User renter = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        // Validate booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        // Check if booking belongs to renter
        if (!booking.getRenter().getId().equals(renter.getId())) {
            throw new IllegalStateException("You can only create feedback for your own bookings");
        }

        // Check if booking is completed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("Feedback can only be created for completed bookings");
        }

        // Check if feedback already exists
        if (feedbackRepository.existsByBookingId(request.getBookingId())) {
            throw new IllegalStateException("Feedback already exists for this booking");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .renter(renter)
                .vehicleRating(request.getVehicleRating())
                .stationRating(request.getStationRating())
                .comment(request.getComment())
                .isEdit(false)
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);
        log.info("Feedback created with ID: {}", savedFeedback.getId());

        return FeedbackMapper.toResponse(savedFeedback);
    }

    @Transactional(readOnly = true)
    public FeedbackDetailResponse getFeedbackById(UUID feedbackId) {
        log.info("Fetching feedback detail with ID: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        String sub = getCognitoSubFromAuthentication();
        User currentUser = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        // Check if user has permission to view this feedback
        if (!feedback.getRenter().getId().equals(currentUser.getId()) &&
            !hasAdminOrStaffRole()) {
            throw new IllegalStateException("You don't have permission to view this feedback");
        }

        User respondedByUser = null;
        if (feedback.getRespondedBy() != null) {
            respondedByUser = userRepository.findById(feedback.getRespondedBy()).orElse(null);
        }

        return FeedbackMapper.toDetailResponse(feedback, respondedByUser);
    }

    @Transactional(readOnly = true)
    public FeedbackDetailResponse getFeedbackByBookingId(UUID bookingId) {
        log.info("Fetching feedback for booking: {}", bookingId);

        Feedback feedback = feedbackRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found for booking: " + bookingId));

        String sub = getCognitoSubFromAuthentication();
        User currentUser = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        // Check permission
        if (!feedback.getRenter().getId().equals(currentUser.getId()) &&
            !hasAdminOrStaffRole()) {
            throw new IllegalStateException("You don't have permission to view this feedback");
        }

        User respondedByUser = null;
        if (feedback.getRespondedBy() != null) {
            respondedByUser = userRepository.findById(feedback.getRespondedBy()).orElse(null);
        }

        return FeedbackMapper.toDetailResponse(feedback, respondedByUser);
    }

    @Transactional
    public FeedbackResponse updateFeedback(UUID feedbackId, UpdateFeedbackRequest request) {
        log.info("Updating feedback with ID: {}", feedbackId);

        String sub = getCognitoSubFromAuthentication();
        User renter = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        // Check if feedback belongs to renter
        if (!feedback.getRenter().getId().equals(renter.getId())) {
            throw new IllegalStateException("You can only update your own feedback");
        }

        // Check if within edit time window
        long daysSinceCreation = Duration.between(feedback.getCreatedAt(), LocalDateTime.now()).toDays();
        if (daysSinceCreation > EDIT_ALLOWED_DAYS) {
            throw new IllegalStateException("Feedback can only be edited within " + EDIT_ALLOWED_DAYS + " days of creation");
        }

        boolean hasChanges = false;

        if (request.getVehicleRating() != null) {
            feedback.setVehicleRating(request.getVehicleRating());
            hasChanges = true;
        }
        if (request.getStationRating() != null) {
            feedback.setStationRating(request.getStationRating());
            hasChanges = true;
        }
        if (request.getComment() != null) {
            feedback.setComment(request.getComment());
            hasChanges = true;
        }

        if (hasChanges) {
            feedback.setIsEdit(true);
        }

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        log.info("Feedback updated successfully with ID: {}", feedbackId);

        return FeedbackMapper.toResponse(updatedFeedback);
    }

    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getMyFeedbacks(Pageable pageable) {
        log.info("Fetching all feedbacks for current renter");

        String sub = getCognitoSubFromAuthentication();
        User renter = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        Page<Feedback> feedbacks = feedbackRepository.findByRenterIdOrderByCreatedAtDesc(renter.getId(), pageable);

        return feedbacks.map(FeedbackMapper::toResponse);
    }

    // ==================== ADMIN/STAFF USE CASES ====================

    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getAllFeedbacksWithFilters(
            UUID stationId,
            UUID vehicleId,
            UUID renterId,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Double minRating,
            Double maxRating,
            Pageable pageable) {
        log.info("Fetching feedbacks with filters");

        Page<Feedback> feedbacks = feedbackRepository.findByFilters(
                stationId, vehicleId, renterId,
                fromDate, toDate, minRating, maxRating, pageable
        );

        return feedbacks.map(FeedbackMapper::toResponse);
    }

    @Transactional
    public FeedbackResponse respondToFeedback(UUID feedbackId, RespondFeedbackRequest request) {
        log.info("Responding to feedback with ID: {}", feedbackId);

        String sub = getCognitoSubFromAuthentication();
        User staff = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        feedback.setResponse(request.getResponse());
        feedback.setRespondedBy(staff.getId());
        feedback.setRespondedAt(LocalDateTime.now());

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        log.info("Response added to feedback ID: {}", feedbackId);

        return FeedbackMapper.toResponse(updatedFeedback);
    }

    @Transactional
    public FeedbackResponse updateResponse(UUID feedbackId, RespondFeedbackRequest request) {
        log.info("Updating response for feedback with ID: {}", feedbackId);

        String sub = getCognitoSubFromAuthentication();
        User staff = userRepository.findByCognitoSub(sub)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with cognito sub: " + sub));

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        if (feedback.getResponse() == null) {
            throw new IllegalStateException("No response exists to update");
        }

        feedback.setResponse(request.getResponse());
        feedback.setRespondedBy(staff.getId());
        feedback.setRespondedAt(LocalDateTime.now());

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        log.info("Response updated for feedback ID: {}", feedbackId);

        return FeedbackMapper.toResponse(updatedFeedback);
    }

    @Transactional
    public void deleteResponse(UUID feedbackId) {
        log.info("Deleting response for feedback with ID: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        feedback.setResponse(null);
        feedback.setRespondedBy(null);
        feedback.setRespondedAt(null);

        feedbackRepository.save(feedback);
        log.info("Response deleted for feedback ID: {}", feedbackId);
    }

    @Transactional
    public void deleteFeedback(UUID feedbackId) {
        log.info("Deleting feedback with ID: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with ID: " + feedbackId));

        feedbackRepository.delete(feedback);
        log.info("Feedback deleted successfully with ID: {}", feedbackId);
    }

    // ==================== PUBLIC USE CASES ====================

    @Transactional(readOnly = true)
    public VehicleFeedbackSummaryResponse getVehicleFeedbackSummary(UUID vehicleId, int limit) {
        log.info("Fetching feedback summary for vehicle: {}", vehicleId);

        Double avgRating = feedbackRepository.findAverageVehicleRating(vehicleId);
        Long totalCount = feedbackRepository.countByVehicleId(vehicleId);

        // Get rating distribution
        Long fiveStarCount = feedbackRepository.countByVehicleIdAndRatingRange(vehicleId, 4.5, 6.0);
        Long fourStarCount = feedbackRepository.countByVehicleIdAndRatingRange(vehicleId, 3.5, 4.5);
        Long threeStarCount = feedbackRepository.countByVehicleIdAndRatingRange(vehicleId, 2.5, 3.5);
        Long twoStarCount = feedbackRepository.countByVehicleIdAndRatingRange(vehicleId, 1.5, 2.5);
        Long oneStarCount = feedbackRepository.countByVehicleIdAndRatingRange(vehicleId, 0.0, 1.5);

        // Get recent feedbacks
        Pageable pageable = PageRequest.of(0, limit);
        Page<Feedback> recentFeedbacks = feedbackRepository.findByVehicleId(vehicleId, pageable);

        List<FeedbackResponse> feedbackResponses = recentFeedbacks.getContent().stream()
                .map(FeedbackMapper::toResponse)
                .collect(Collectors.toList());

        return VehicleFeedbackSummaryResponse.builder()
                .vehicleId(vehicleId)
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalFeedbackCount(totalCount != null ? totalCount : 0L)
                .fiveStarCount(fiveStarCount != null ? fiveStarCount : 0L)
                .fourStarCount(fourStarCount != null ? fourStarCount : 0L)
                .threeStarCount(threeStarCount != null ? threeStarCount : 0L)
                .twoStarCount(twoStarCount != null ? twoStarCount : 0L)
                .oneStarCount(oneStarCount != null ? oneStarCount : 0L)
                .recentFeedbacks(feedbackResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public StationFeedbackSummaryResponse getStationFeedbackSummary(UUID stationId, int limit) {
        log.info("Fetching feedback summary for station: {}", stationId);

        Double avgRating = feedbackRepository.findAverageStationRating(stationId);
        Long totalCount = feedbackRepository.countByStationId(stationId);

        // Get rating distribution
        Long fiveStarCount = feedbackRepository.countByStationIdAndRatingRange(stationId, 4.5, 6.0);
        Long fourStarCount = feedbackRepository.countByStationIdAndRatingRange(stationId, 3.5, 4.5);
        Long threeStarCount = feedbackRepository.countByStationIdAndRatingRange(stationId, 2.5, 3.5);
        Long twoStarCount = feedbackRepository.countByStationIdAndRatingRange(stationId, 1.5, 2.5);
        Long oneStarCount = feedbackRepository.countByStationIdAndRatingRange(stationId, 0.0, 1.5);

        // Get recent feedbacks
        Pageable pageable = PageRequest.of(0, limit);
        Page<Feedback> recentFeedbacks = feedbackRepository.findByStationId(stationId, pageable);

        List<FeedbackResponse> feedbackResponses = recentFeedbacks.getContent().stream()
                .map(FeedbackMapper::toResponse)
                .collect(Collectors.toList());

        return StationFeedbackSummaryResponse.builder()
                .stationId(stationId)
                .averageRating(avgRating != null ? avgRating : 0.0)
                .totalFeedbackCount(totalCount != null ? totalCount : 0L)
                .fiveStarCount(fiveStarCount != null ? fiveStarCount : 0L)
                .fourStarCount(fourStarCount != null ? fourStarCount : 0L)
                .threeStarCount(threeStarCount != null ? threeStarCount : 0L)
                .twoStarCount(twoStarCount != null ? twoStarCount : 0L)
                .oneStarCount(oneStarCount != null ? oneStarCount : 0L)
                .recentFeedbacks(feedbackResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getPublicVehicleFeedbacks(UUID vehicleId, Pageable pageable) {
        log.info("Fetching public feedbacks for vehicle: {}", vehicleId);

        Page<Feedback> feedbacks = feedbackRepository.findByVehicleId(vehicleId, pageable);
        return feedbacks.map(FeedbackMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getPublicStationFeedbacks(UUID stationId, Pageable pageable) {
        log.info("Fetching public feedbacks for station: {}", stationId);

        Page<Feedback> feedbacks = feedbackRepository.findByStationId(stationId, pageable);
        return feedbacks.map(FeedbackMapper::toResponse);
    }

    // ==================== STATISTICS ====================

    @Transactional(readOnly = true)
    public FeedbackStatisticsResponse getGlobalStatistics() {
        log.info("Fetching global feedback statistics");

        Long totalCount = feedbackRepository.count();
        Long respondedCount = feedbackRepository.countRespondedFeedbacks();
        Long unrespondedCount = feedbackRepository.countUnrespondedFeedbacks();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        Long feedbacksLast7Days = feedbackRepository.countFeedbacksSinceDate(sevenDaysAgo);
        Long feedbacksLast30Days = feedbackRepository.countFeedbacksSinceDate(thirtyDaysAgo);

        Double avgResponseTime = feedbackRepository.findAverageResponseTimeInHours();

        // Rating distributions
        List<Object[]> vehicleRatingDist = feedbackRepository.getVehicleRatingDistribution();
        Map<Integer, Long> vehicleRatingMap = new HashMap<>();
        for (Object[] row : vehicleRatingDist) {
            vehicleRatingMap.put((Integer) row[0], (Long) row[1]);
        }

        List<Object[]> stationRatingDist = feedbackRepository.getStationRatingDistribution();
        Map<Integer, Long> stationRatingMap = new HashMap<>();
        for (Object[] row : stationRatingDist) {
            stationRatingMap.put((Integer) row[0], (Long) row[1]);
        }

        // Top rated
        List<Object[]> topVehicles = feedbackRepository.findTopRatedVehicles(PageRequest.of(0, 1));
        Map<String, Object> topVehicle = null;
        if (!topVehicles.isEmpty()) {
            Object[] row = topVehicles.get(0);
            topVehicle = Map.of(
                    "id", row[0],
                    "name", row[1],
                    "averageRating", row[2]
            );
        }

        List<Object[]> topStations = feedbackRepository.findTopRatedStations(PageRequest.of(0, 1));
        Map<String, Object> topStation = null;
        if (!topStations.isEmpty()) {
            Object[] row = topStations.get(0);
            topStation = Map.of(
                    "id", row[0],
                    "name", row[1],
                    "averageRating", row[2]
            );
        }

        return FeedbackStatisticsResponse.builder()
                .totalFeedbackCount(totalCount)
                .respondedCount(respondedCount != null ? respondedCount : 0L)
                .unrespondedCount(unrespondedCount != null ? unrespondedCount : 0L)
                .vehicleRatingDistribution(vehicleRatingMap)
                .stationRatingDistribution(stationRatingMap)
                .topRatedVehicle(topVehicle)
                .topRatedStation(topStation)
                .feedbacksLast7Days(feedbacksLast7Days != null ? feedbacksLast7Days : 0L)
                .feedbacksLast30Days(feedbacksLast30Days != null ? feedbacksLast30Days : 0L)
                .averageResponseTimeHours(avgResponseTime)
                .build();
    }

    // ==================== HELPER METHODS ====================

    private String getEmailFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaim("email");
        }
        throw new IllegalStateException("User is not authenticated");
    }

    private String getCognitoSubFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaim("sub");
        }
        throw new IllegalStateException("User is not authenticated");
    }

    private boolean hasAdminOrStaffRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority ->
                            grantedAuthority.getAuthority().equals("ROLE_ADMIN") ||
                            grantedAuthority.getAuthority().equals("ROLE_STAFF"));
        }
        return false;
    }
}
