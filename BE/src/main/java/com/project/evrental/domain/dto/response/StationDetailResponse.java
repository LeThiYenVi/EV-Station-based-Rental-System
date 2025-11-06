package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.StationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StationDetailResponse {

    UUID id;

    String name;

    String address;

    Double rating;

    BigDecimal latitude;

    BigDecimal longitude;

    String hotline;

    StationStatus status;

    String photo;

    LocalDateTime startTime;

    LocalDateTime endTime;

    Integer totalVehicles;

    Integer availableVehicles;

    List<VehicleResponse> vehicles;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
