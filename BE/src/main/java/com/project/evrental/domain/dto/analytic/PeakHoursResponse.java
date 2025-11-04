package com.project.evrental.domain.dto.analytic;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeakHoursResponse {
    private UUID stationId;
    private String stationName;
    private Map<Integer, Long> hourlyBookingCounts;
    private Integer peakHour;
    private Long peakHourBookings;
    private List<Integer> topThreeHours;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}