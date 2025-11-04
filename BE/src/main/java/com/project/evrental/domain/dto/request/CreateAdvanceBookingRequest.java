package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAdvanceBookingRequest {
    @NotNull(message = "Vehicle ID is required")
    private UUID vehicleId;

    @NotNull(message = "Station ID is required")
    private UUID stationId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "Expected end time is required")
    private LocalDateTime expectedEndTime;

    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String note;
}
