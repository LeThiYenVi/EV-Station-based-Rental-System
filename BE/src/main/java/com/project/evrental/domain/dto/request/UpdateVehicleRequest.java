package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.FuelType;
import com.project.evrental.domain.common.VehicleStatus;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateVehicleRequest {

    UUID stationId;

    @Size(min = 5, max = 20, message = "License plate must be between 5 and 20 characters")
    String licensePlate;

    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    String name;

    @Size(max = 100, message = "Brand cannot exceed 100 characters")
    String brand;

    String color;

    FuelType fuelType;

    @Min(value = 1, message = "Capacity must be at least 1")
    Integer capacity;

    String[] photos;

    VehicleStatus status;

    @DecimalMin(value = "0.0", message = "Hourly rate must be greater than or equal to 0")
    BigDecimal hourlyRate;

    @DecimalMin(value = "0.0", message = "Daily rate must be greater than or equal to 0")
    BigDecimal dailyRate;

    @DecimalMin(value = "0.0", message = "Deposit amount must be greater than or equal to 0")
    BigDecimal depositAmount;

    @DecimalMin(value = "0.0", message = "Rating must be greater than or equal to 0")
    @DecimalMax(value = "5.0", message = "Rating must be less than or equal to 5")
    Double rating;
}
