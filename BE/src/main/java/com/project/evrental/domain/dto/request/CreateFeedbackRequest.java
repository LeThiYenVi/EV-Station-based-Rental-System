package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeedbackRequest {

    @NotNull(message = "Booking ID is required")
    private UUID bookingId;

    @NotNull(message = "Vehicle rating is required")
    @Min(value = 1, message = "Vehicle rating must be at least 1")
    @Max(value = 5, message = "Vehicle rating must be at most 5")
    private Double vehicleRating;

    @NotNull(message = "Station rating is required")
    @Min(value = 1, message = "Station rating must be at least 1")
    @Max(value = 5, message = "Station rating must be at most 5")
    private Double stationRating;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    private String comment;
}
