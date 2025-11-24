package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class StaffPerformanceResponse {
    UUID staffId;
    String fullName;
    long handoversOut;
    long handoversIn;
    // double avgStationRating;
    // double avgVehicleRating;
}
