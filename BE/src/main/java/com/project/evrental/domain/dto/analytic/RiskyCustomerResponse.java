package com.project.evrental.domain.dto.analytic;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskyCustomerResponse {
    private UUID customerId;
    private String fullName;
    private String email;
    private String phone;
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer cancelledBookings;
    private Integer overdueReturns;
    private BigDecimal totalDamages;
    private Integer violationCount;
    private Double riskScore;
    private String riskLevel; // LOW, MEDIUM, HIGH
    private LocalDateTime lastBookingDate;
    private String notes;
}