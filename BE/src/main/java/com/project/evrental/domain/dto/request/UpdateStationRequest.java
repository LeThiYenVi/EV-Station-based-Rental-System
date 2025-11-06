package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.StationStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStationRequest {

    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    String name;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    String address;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    BigDecimal longitude;

    @Pattern(regexp = "^[0-9+\\-() ]+$", message = "Invalid hotline format")
    String hotline;

    String photo;

    StationStatus status;

    LocalDateTime startTime;

    LocalDateTime endTime;

    @DecimalMin(value = "0.0", message = "Rating must be >= 0")
    @DecimalMax(value = "5.0", message = "Rating must be <= 5")
    Double rating;
}
