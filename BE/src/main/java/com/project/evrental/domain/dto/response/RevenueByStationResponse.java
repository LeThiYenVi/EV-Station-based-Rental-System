package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.UUID;

@Value
@Builder
public class RevenueByStationResponse {
    UUID stationId;
    BigDecimal revenue;
    Long bookingCount;
}
