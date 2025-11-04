package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoApiQueryRequest {
    private String partnerCode;
    private String accessKey;
    private String requestId;
    private String orderId;
    private String signature;
}