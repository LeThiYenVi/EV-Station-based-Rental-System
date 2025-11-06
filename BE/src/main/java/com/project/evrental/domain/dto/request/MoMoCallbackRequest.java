package com.project.evrental.domain.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MoMoCallbackRequest {

    String partnerCode;

    String orderId;

    String requestId;

    Long amount;

    String orderInfo;

    String orderType;

    Long transId;

    String resultCode;

    String message;

    String payType;

    Long responseTime;

    String extraData;

    String signature;
}
