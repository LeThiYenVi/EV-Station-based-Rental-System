package com.project.evrental.domain.dto.analytic;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenue {
    private LocalDateTime date;
    private BigDecimal revenue;
    private Integer bookingCount;
}