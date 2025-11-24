package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class CustomerRiskResponse {
    UUID renterId;
    long totalBookings;
    long cancellations;
    long lateReturns;
    double avgFeedbackRating;
    double totalExtraFees;
    long negativeFeedbacks;
    double riskScore; // Computed
}
