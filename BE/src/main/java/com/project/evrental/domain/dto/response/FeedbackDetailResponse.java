package com.project.evrental.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDetailResponse {

    private UUID id;
    
    // Booking information
    private UUID bookingId;
    private String bookingCode;
    private LocalDateTime bookingStartTime;
    private LocalDateTime bookingEndTime;
    private BigDecimal bookingTotalAmount;
    
    // Renter information
    private UUID renterId;
    private String renterName;
    private String renterEmail;
    private String renterPhone;
    
    // Vehicle information
    private UUID vehicleId;
    private String vehicleName;
    private String vehicleLicensePlate;
    private String vehicleBrand;
    private String[] vehiclePhotos;
    
    // Station information
    private UUID stationId;
    private String stationName;
    private String stationAddress;
    
    // Feedback content
    private Double vehicleRating;
    private Double stationRating;
    private String comment;
    private Boolean isEdit;
    
    // Response information
    private String response;
    private UUID respondedBy;
    private String respondedByName;
    private String respondedByEmail;
    private LocalDateTime respondedAt;
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
