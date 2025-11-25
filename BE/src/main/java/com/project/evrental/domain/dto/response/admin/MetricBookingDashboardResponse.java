package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class MetricBookingDashboardResponse {
    long totalBooking;
    BigDecimal totalRevenueFromCompletedBooking;
    long totalConfirmBooking;
    long totalOnGoingBooking;
}
