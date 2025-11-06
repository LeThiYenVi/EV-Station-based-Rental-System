package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleDetailResponse {

    UUID id;

    UUID stationId;

    String stationName;

    String licensePlate;

    String name;

    String brand;

    String color;

    String fuelType;

    BigDecimal rating;

    Integer capacity;

    Integer rentCount;

    String[] photos;

    String status;

    BigDecimal hourlyRate;

    BigDecimal dailyRate;

    BigDecimal depositAmount;

    Boolean isAvailable;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
