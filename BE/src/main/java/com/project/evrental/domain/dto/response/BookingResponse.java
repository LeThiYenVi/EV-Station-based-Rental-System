package com.project.evrental.domain.dto.response;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.PaymentStatus;
import com.project.evrental.domain.common.VehicleStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private UUID id;
    private String bookingCode;

    // Renter info
    private UUID renterId;
    private String renterName;
    private String renterPhone;
    private String renterEmail;

    // Vehicle info
    private UUID vehicleId;
    private String vehicleName;
    private String licensePlate;
    private String vehicleBrand;
    private VehicleStatus vehicleStatus;

    // Station info
    private UUID stationId;
    private String stationName;
    private String stationAddress;
    private String stationHotline;

    // Booking details
    private LocalDateTime startTime;
    private LocalDateTime expectedEndTime;
    private LocalDateTime actualEndTime;
    private BookingStatus status;

    // Pricing
    private BigDecimal basePrice;
    private BigDecimal depositPaid;
    private BigDecimal extraFee;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;

    // Notes
    private String pickupNote;
    private String returnNote;

    // Staff info
    private String checkedOutBy;
    private String checkedInBy;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Computed fields
    private Long durationHours;
    private Boolean isOverdue;
    private Boolean canCancel;
    private Boolean canCheckout;
    private Boolean canCheckin;
    private Boolean canProvideFeedback;
}