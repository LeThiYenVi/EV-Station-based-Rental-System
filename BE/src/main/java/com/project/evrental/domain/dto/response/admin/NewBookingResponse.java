package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.util.UUID;

@Value
@Builder
public class NewBookingResponse {
    UUID bookingId;
    String fullName;
    String vehicleName;
    String timeAgo;
}
