package com.project.evrental.domain.dto.response;

import lombok.*;

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
    private String renterName;
    private String vehicleName;
    private String licensePlate;
    private String stationName;
    private Double vehicleRating;
    private Double stationRating;
    private Double averageRating;
    private String comment;
    private Boolean isEdit;
    private String response;
    private String respondedByName;
    private UUID respondedBy;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean canEdit;
    private Boolean canRespond;
}