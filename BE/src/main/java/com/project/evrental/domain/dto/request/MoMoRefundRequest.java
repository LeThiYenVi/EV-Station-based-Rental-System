package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoRefundRequest {
    private String orderId;
    private String transId;
    private Long amount;
    private String description;
}