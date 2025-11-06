package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingRequest {

    private LocalDateTime startTime;

    private LocalDateTime expectedEndTime;

    private LocalDateTime actualEndTime;

    private BookingStatus status;

    private BigDecimal extraFee;

    private String pickupNote;

    private String returnNote;
}
