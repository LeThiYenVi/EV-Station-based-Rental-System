package com.project.evrental.domain.entity;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.BookingType;
import com.project.evrental.domain.common.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @Column(columnDefinition = "uuid")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String bookingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renter_id", nullable = false)
    private User renter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type")
    private BookingType bookingType;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "expected_end_time")
    private LocalDateTime expectedEndTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_out_by", columnDefinition = "uuid", nullable = false)
    private User checkedOutBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by", columnDefinition = "uuid")
    private User checkedInBy;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "deposit_paid")
    private BigDecimal depositPaid;

    @Column(name = "extra_fee")
    private BigDecimal extraFee;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "pickup_note", columnDefinition = "TEXT")
    private String pickupNote;

    @Column(name = "return_note", columnDefinition = "TEXT")
    private String returnNote;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Feedback feedback;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}