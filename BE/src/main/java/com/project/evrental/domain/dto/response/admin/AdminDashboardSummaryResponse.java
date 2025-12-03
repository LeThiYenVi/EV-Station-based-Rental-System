package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AdminDashboardSummaryResponse {
    UserReportAdminDashboardSummary userReport;
    VehicleReportAdminDashboardSummary vehicleReport;
    BookingReportAdminDashboardSummary bookingReport;
    RevenueReportAdminDashboardSummary revenueReport;
}
