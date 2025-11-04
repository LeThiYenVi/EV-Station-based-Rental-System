package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoCallbackRequest {
    private String orderId;
    private String transId;
    private Integer resultCode;
    private String message;
    private Long amount;
    private String signature;
}