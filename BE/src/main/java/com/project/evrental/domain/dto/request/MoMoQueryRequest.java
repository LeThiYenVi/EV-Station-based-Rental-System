package com.project.evrental.domain.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoMoQueryRequest {
    private String orderId;
    private String requestId;
}