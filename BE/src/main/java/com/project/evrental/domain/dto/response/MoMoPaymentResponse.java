package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MoMoPaymentResponse {

    String partnerCode;

    String orderId;

    String requestId;

    Long amount;

    Long responseTime;

    String message;

    String resultCode;

    String payUrl;

    String deeplink;

    String qrCodeUrl;
}
