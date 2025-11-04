package com.project.evrental.domain.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoQueryResponse {
    private Integer resultCode;
    private String message;
    private String orderId;
    private String transId;
    private Long amount;
}