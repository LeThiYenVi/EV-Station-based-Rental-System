package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSummaryResponse {
    private UUID id;
    private String bookingCode;
    private String renterName;
    private String vehicleName;
    private String licensePlate;
    private LocalDateTime startTime;
    private LocalDateTime expectedEndTime;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
}