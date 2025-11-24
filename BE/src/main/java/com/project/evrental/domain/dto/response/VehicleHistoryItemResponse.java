package com.project.evrental.domain.dto.response;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
public class VehicleHistoryItemResponse {
    UUID bookingId;
    String bookingCode;
    LocalDateTime startTime;
    LocalDateTime expectedEndTime;
    LocalDateTime actualEndTime;
    String status;
    UUID renterId;
    UUID checkedOutBy;
    UUID checkedInBy;
}
