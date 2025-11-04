package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoApiRefundRequest {
    private String partnerCode;
    private String accessKey;
    private String requestId;
    private String orderId;
    private String transId;
    private Long amount;
    private String description;
    private String signature;
}