package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VehicleReportAdminDashboardSummary {
    long countAllVehicles;
    long countVehicleAvailable;
    long countRentedAvailable;
    double fleetGrowth; // percentage
}
