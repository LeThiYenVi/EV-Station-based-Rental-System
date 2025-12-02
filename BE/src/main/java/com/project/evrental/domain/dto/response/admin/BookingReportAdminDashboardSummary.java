package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingReportAdminDashboardSummary {
    long countAllBookings;
    long countBookingsToday;
    long countThisMonth;
    double radiationWithMonthAgo; // percentage
}
