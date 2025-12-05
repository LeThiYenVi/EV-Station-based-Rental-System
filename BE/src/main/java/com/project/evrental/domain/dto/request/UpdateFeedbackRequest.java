package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFeedbackRequest {

    @Min(value = 1, message = "Vehicle rating must be at least 1")
    @Max(value = 5, message = "Vehicle rating must be at most 5")
    private Double vehicleRating;

    @Min(value = 1, message = "Station rating must be at least 1")
    @Max(value = 5, message = "Station rating must be at most 5")
    private Double stationRating;

    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    private String comment;
}
