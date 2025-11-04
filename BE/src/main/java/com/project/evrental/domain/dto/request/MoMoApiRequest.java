package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoApiRequest {
    private String partnerCode;
    private String accessKey;
    private String requestId;
    private String orderId;
    private Long amount;
    private String orderInfo;
    private String returnUrl;
    private String notifyUrl;
    private String requestType;
    private String signature;
}