package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.PaymentMethod;
import com.project.evrental.domain.common.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private UUID bookingId;
    private String bookingCode;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private String momoPayUrl;
}