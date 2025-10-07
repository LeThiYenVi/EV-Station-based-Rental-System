package com.project.evrental.domain.dto.response;

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
public class NearbyStationResponse {

    UUID id;

    String name;

    String address;

    Double rating;

    BigDecimal latitude;

    BigDecimal longitude;

    String hotline;

    String status;

    String photo;

    Double distanceKm;

    LocalDateTime startTime;

    LocalDateTime endTime;

    Integer availableVehiclesCount;

    List<AvailableVehicleSummary> availableVehicles;

}
