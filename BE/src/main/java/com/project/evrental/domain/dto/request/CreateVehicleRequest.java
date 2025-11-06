package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.FuelType;
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
public class CreateVehicleRequest {

    @NotNull(message = "Station ID is required")
    UUID stationId;

    @NotBlank(message = "License plate is required")
    @Size(min = 5, max = 20, message = "License plate must be between 5 and 20 characters")
    String licensePlate;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 255, message = "Name must be between 3 and 255 characters")
    String name;

    @NotBlank(message = "Brand is required")
    @Size(max = 100, message = "Brand cannot exceed 100 characters")
    String brand;

    String color;

    @NotNull(message = "Fuel type is required")
    FuelType fuelType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    Integer capacity;

    String[] photos;

    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.0", message = "Hourly rate must be greater than or equal to 0")
    BigDecimal hourlyRate;

    @NotNull(message = "Daily rate is required")
    @DecimalMin(value = "0.0", message = "Daily rate must be greater than or equal to 0")
    BigDecimal dailyRate;

    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "0.0", message = "Deposit amount must be greater than or equal to 0")
    BigDecimal depositAmount;
}
