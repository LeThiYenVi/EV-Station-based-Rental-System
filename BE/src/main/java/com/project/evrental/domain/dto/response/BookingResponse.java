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
public class BookingResponse {

    private UUID id;

    private String bookingCode;

    private UUID renterId;

    private String renterName;

    private String renterEmail;

    private UUID vehicleId;

    private String vehicleName;

    private String licensePlate;

    private UUID stationId;

    private String stationName;

    private LocalDateTime startTime;

    private LocalDateTime expectedEndTime;

    private LocalDateTime actualEndTime;

    private String status;

    private UUID checkedOutById;

    private String checkedOutByName;

    private UUID checkedInById;

    private String checkedInByName;

    private BigDecimal basePrice;

    private BigDecimal depositPaid;

    private BigDecimal extraFee;

    private BigDecimal totalAmount;

    private String pickupNote;

    private String returnNote;

    private String paymentStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
