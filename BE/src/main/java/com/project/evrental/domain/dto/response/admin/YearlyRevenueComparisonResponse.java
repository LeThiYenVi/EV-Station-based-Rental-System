package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class YearlyRevenueComparisonResponse {
    BigDecimal totalRevenueThisYear;
    List<MonthlyRevenueDetail> monthlyRevenueThisYear;
    BigDecimal totalRevenueLastYear;
    List<MonthlyRevenueDetail> monthlyRevenueLastYear;
    double growthPercentage; // positive = growth, negative = decline
}
