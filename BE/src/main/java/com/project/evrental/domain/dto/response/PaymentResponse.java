package com.project.evrental.domain.dto.response;

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
public class PaymentResponse {

    UUID id;

    UUID bookingId;

    BigDecimal amount;

    String paymentMethod;

    String status;

    String transactionId;

    LocalDateTime paidAt;

    LocalDateTime createdAt;
}
