package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VehicleStatusDistributionResponse {
    long countAvailable;
    long countMaintenance;
    long countRented;
    long countUnavailable;
    long countCharging;
}
