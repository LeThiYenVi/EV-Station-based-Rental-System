package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingPerformanceResponse {
    long totalCompleted;
    long totalOnGoing;
    long totalActive;
    double successRate; // percentage
}
