package com.project.evrental.domain.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoRefundResponse {
    private Integer resultCode;
    private String message;
    private String transId;
    private String orderId;
}