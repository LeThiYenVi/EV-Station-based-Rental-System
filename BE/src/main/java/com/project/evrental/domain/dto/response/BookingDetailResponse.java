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
public class BookingDetailResponse {

    private UUID id;

    private String bookingCode;

    private UserResponse renter;

    private VehicleDetailResponse vehicle;

    private StationResponse station;

    private LocalDateTime startTime;

    private LocalDateTime expectedEndTime;

    private LocalDateTime actualEndTime;

    private String status;

    private UserResponse checkedOutBy;

    private UserResponse checkedInBy;

    private BigDecimal basePrice;

    private BigDecimal depositPaid;

    private BigDecimal extraFee;

    private BigDecimal totalAmount;

    private String pickupNote;

    private String returnNote;

    private String paymentStatus;

    private Long durationHours;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
