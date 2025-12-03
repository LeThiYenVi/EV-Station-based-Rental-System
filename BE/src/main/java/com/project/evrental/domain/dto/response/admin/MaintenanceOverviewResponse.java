package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MaintenanceOverviewResponse {
    long totalInMaintenance;
    long totalUnavailable;
    long totalCharging;
}
