package com.project.evrental.domain.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoPaymentRequest {
    private String orderId;
    private BigDecimal amount;
    private String orderInfo;
    private String returnUrl;
    private String notifyUrl;
}