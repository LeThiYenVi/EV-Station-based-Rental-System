package com.project.evrental.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackStatisticsResponse {

    private Double averageVehicleRating;
    private Double averageStationRating;
    private Long totalFeedbackCount;
    private Long respondedCount;
    private Long unrespondedCount;
    
    // Rating distribution (1-5 stars)
    private Map<Integer, Long> vehicleRatingDistribution;
    private Map<Integer, Long> stationRatingDistribution;
    
    // Top rated
    private Map<String, Object> topRatedVehicle;
    private Map<String, Object> topRatedStation;
    
    // Recent statistics
    private Long feedbacksLast7Days;
    private Long feedbacksLast30Days;
    private Double averageResponseTimeHours;
}
