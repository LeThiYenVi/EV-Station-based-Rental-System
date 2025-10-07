package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvailableVehicleSummary {

    UUID id;

    String name;

    String brand;

    String licensePlate;

    String fuelType;

    Double rating;

    Integer capacity;

    BigDecimal hourlyRate;

    Integer rentCount;

    BigDecimal dailyRate;

    String[] photos;

    BigDecimal depositAmount;
}
