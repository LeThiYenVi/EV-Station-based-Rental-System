package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class RevenueAndBookingInChartResponse {
    String month; // e.g., "2025-01", "2025-02"
    BigDecimal revenue;
    long countBookingByMonth;
}
