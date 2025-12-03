package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class MonthlyRevenueDetail {
    int month; // 1-12
    BigDecimal revenue;
}
