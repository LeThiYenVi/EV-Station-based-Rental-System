package com.project.evrental.domain.dto.analytic;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffPerformanceResponse {
    private UUID staffId;
    private String fullName;
    private String email;
    private UUID stationId;
    private String stationName;
    private Integer totalCheckouts;
    private Integer totalCheckins;
    private Double averageCustomerRating;
    private Integer issuesResolved;
    private BigDecimal revenueGenerated;
    private Double efficiencyScore;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
