package com.project.evrental.domain.entity;

import com.project.evrental.domain.common.FuelType;
import com.project.evrental.domain.common.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @Column(columnDefinition = "uuid")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    private String name;

    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "rent_count")
    private Integer rentCount = 0;

    @Column(name = "photos", columnDefinition = "text[]")
    private String[] photos;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "daily_rate")
    private BigDecimal dailyRate;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @Column(name = "polices", columnDefinition = "text[]")
    private String[] polices;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}