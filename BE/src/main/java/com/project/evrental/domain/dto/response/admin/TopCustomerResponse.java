package com.project.evrental.domain.dto.response.admin;

import com.project.evrental.domain.dto.response.UserResponse;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class TopCustomerResponse {
    UserResponse user;
    BigDecimal totalSpent;
    long bookingCount;
}
