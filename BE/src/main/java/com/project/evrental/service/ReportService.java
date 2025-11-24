package com.project.evrental.service;

import com.project.evrental.domain.dto.response.*;
import com.project.evrental.repository.AnalyticsRepository;
import com.project.evrental.repository.CustomerAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AnalyticsRepository analyticsRepository;
    private final CustomerAnalyticsRepository customerAnalyticsRepository;

    public List<RevenueByStationResponse> revenueByStation(LocalDateTime start, LocalDateTime end, UUID stationId) {
        return analyticsRepository.revenueByStation(start, end, stationId).stream()
                .map(p -> RevenueByStationResponse.builder()
                        .stationId(p.getStationId())
                        .revenue(p.getRevenue())
                        .bookingCount(p.getBookingCount())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UtilizationResponse> utilization(LocalDateTime start, LocalDateTime end, UUID stationId) {
        return analyticsRepository.utilizationByStation(start, end, stationId).stream()
                .map(p -> UtilizationResponse.builder()
                        .stationId(p.getStationId())
                        .utilization(p.getUtilization() == null ? 0.0 : p.getUtilization())
                        .vehicleCount(p.getVehicleCount() == null ? 0L : p.getVehicleCount())
                        .activeBookingSeconds(p.getActiveBookingSeconds() == null ? 0L : p.getActiveBookingSeconds())
                        .build())
                .collect(Collectors.toList());
    }

    public List<PeakHourResponse> peakHours(LocalDateTime start, LocalDateTime end, UUID stationId) {
        return analyticsRepository.peakHours(start, end, stationId).stream()
                .map(p -> PeakHourResponse.builder()
                        .hour(p.getHour())
                        .bookingCount(p.getBookingCount())
                        .build())
                .collect(Collectors.toList());
    }

    public List<StaffPerformanceResponse> staffPerformance(LocalDateTime start, LocalDateTime end, UUID stationId) {
        return analyticsRepository.staffPerformance(start, end, stationId).stream()
                .map(p -> StaffPerformanceResponse.builder()
                        .staffId(p.getStaffId())
                        .fullName(p.getFullName())
                        .handoversOut(p.getHandoversOut())
                        .handoversIn(p.getHandoversIn())
                        // .avgStationRating(p.getAvgStationRating() == null ? 0.0 : p.getAvgStationRating())
                        // .avgVehicleRating(p.getAvgVehicleRating() == null ? 0.0 : p.getAvgVehicleRating())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CustomerRiskResponse> customerRiskList(int minBookings) {
        return customerAnalyticsRepository.customerRiskMetrics(minBookings).stream()
                .map(p -> {
                    double risk = computeRiskScore(
                            p.getCancellations(), p.getLateReturns(),
                            p.getAvgFeedbackRating(), p.getNegativeFeedbacks());
                    return CustomerRiskResponse.builder()
                            .renterId(p.getRenterId())
                            .totalBookings(p.getTotalBookings())
                            .cancellations(p.getCancellations())
                            .lateReturns(p.getLateReturns())
                            .avgFeedbackRating(p.getAvgFeedbackRating() == null ? 0.0 : p.getAvgFeedbackRating())
                            .negativeFeedbacks(p.getNegativeFeedbacks())
                            .riskScore(risk)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Simple weighted risk scoring. Tune weights as needed.
    private double computeRiskScore(long cancellations, long lateReturns, Double avgRating,
                                    long negativeFeedbacks) {
        double ratingPenalty = Math.max(0, 5.0 - (avgRating == null ? 5.0 : avgRating)) * 2.0;
        double cancelPenalty = cancellations * 3.0;
        double latePenalty = lateReturns * 2.0;
        double negativePenalty = negativeFeedbacks * 2.5;
        return Math.min(100.0, ratingPenalty + cancelPenalty + latePenalty + negativePenalty);
    }
}
