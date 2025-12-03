package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MetricVehicleManagementResponse {
    long totalVehicles;
    long totalAvailable;
    long totalOnGoing;
    long totalMaintenance;
}
