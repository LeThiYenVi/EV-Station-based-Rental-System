package com.project.evrental.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {

    private UUID id;
    private UUID bookingId;
    private String bookingCode;
    private UUID renterId;
    private String renterName;
    private String renterEmail;
    private UUID vehicleId;
    private String vehicleName;
    private String vehicleLicensePlate;
    private UUID stationId;
    private String stationName;
    private Double vehicleRating;
    private Double stationRating;
    private String comment;
    private Boolean isEdit;
    private String response;
    private UUID respondedBy;
    private String respondedByName;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
