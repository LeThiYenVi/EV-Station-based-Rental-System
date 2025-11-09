package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class UtilizationResponse {
    UUID stationId;
    double utilization; // 0..1
    long vehicleCount;
    long activeBookingSeconds;
}
