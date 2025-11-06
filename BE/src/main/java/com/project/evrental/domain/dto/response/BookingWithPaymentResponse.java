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
public class BookingWithPaymentResponse {

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

    private String status;

    private BigDecimal basePrice;

    private BigDecimal depositPaid;

    private BigDecimal totalAmount;

    private String pickupNote;

    private String paymentStatus;

    private MoMoPaymentResponse momoPayment;

    private LocalDateTime createdAt;
}
