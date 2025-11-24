package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PeakHourResponse {
    int hour; // 0-23
    long bookingCount;
}
