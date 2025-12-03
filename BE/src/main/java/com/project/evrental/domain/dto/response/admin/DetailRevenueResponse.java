package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class DetailRevenueResponse {
    BigDecimal revenueFromRental; // from base_price
    BigDecimal revenueFromExtraFee; // from extra_fee
}
