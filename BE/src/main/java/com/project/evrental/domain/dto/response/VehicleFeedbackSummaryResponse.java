package com.project.evrental.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleFeedbackSummaryResponse {

    private UUID vehicleId;
    private String vehicleName;
    private String vehicleLicensePlate;
    private Double averageRating;
    private Long totalFeedbackCount;
    private Long fiveStarCount;
    private Long fourStarCount;
    private Long threeStarCount;
    private Long twoStarCount;
    private Long oneStarCount;
    private List<FeedbackResponse> recentFeedbacks;
}
