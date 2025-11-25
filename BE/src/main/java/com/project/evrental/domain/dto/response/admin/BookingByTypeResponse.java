package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class BookingByTypeResponse {
    String type; // "ELECTRICITY", "GASOLINE"
    long countBookings;
    BigDecimal totalByBookingType;
}
