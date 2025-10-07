package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.FuelType;
import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.entity.Station;
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
public class VehicleResponse {

    UUID id;
    
    UUID stationId;
    
    String licensePlate;

    String name;

    String brand;
    
    String fuelType;

    BigDecimal rating;

    Integer capacity;

    Integer rentCount;

    String[] photos;
    
    String status;
    
    BigDecimal hourlyRate;

    BigDecimal dailyRate;

    BigDecimal depositAmount;

    String[] polices;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
