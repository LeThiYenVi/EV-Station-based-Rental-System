package com.project.evrental.domain.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoPaymentResponse {
    private Integer resultCode;
    private String message;
    private String payUrl;
    private String transId;
    private String orderId;
}