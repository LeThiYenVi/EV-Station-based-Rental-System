package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.StationStatus;
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
public class StationResponse {

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

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
