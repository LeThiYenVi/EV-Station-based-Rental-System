package com.project.evrental.domain.dto.analytic;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportResponse {
    private UUID stationId;
    private String stationName;
    private BigDecimal totalRevenue;
    private BigDecimal baseRevenue;
    private BigDecimal depositRevenue;
    private BigDecimal extraFeeRevenue;
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer cancelledBookings;
    private Double averageBookingValue;
    private Double completionRate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<DailyRevenue> dailyBreakdown;
}