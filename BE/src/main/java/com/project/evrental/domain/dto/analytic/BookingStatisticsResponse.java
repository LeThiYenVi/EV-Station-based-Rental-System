package com.project.evrental.domain.dto.analytic;

import com.project.evrental.domain.common.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatisticsResponse {
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long ongoingBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Map<BookingStatus, Long> statusBreakdown;
    private Double cancellationRate;
    private Double completionRate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
