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
public class StationFeedbackSummaryResponse {

    private UUID stationId;
    private String stationName;
    private String stationAddress;
    private Double averageRating;
    private Long totalFeedbackCount;
    private Long fiveStarCount;
    private Long fourStarCount;
    private Long threeStarCount;
    private Long twoStarCount;
    private Long oneStarCount;
    private List<FeedbackResponse> recentFeedbacks;
}
