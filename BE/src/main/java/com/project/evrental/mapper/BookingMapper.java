package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.BookingDetailResponse;
import com.project.evrental.domain.dto.response.BookingResponse;
import com.project.evrental.domain.dto.response.VehicleDetailResponse;
import com.project.evrental.domain.entity.Booking;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingMapper {

    StationMapper stationMapper;

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .renterId(booking.getRenter().getId())
                .renterName(booking.getRenter().getFullName())
                .renterEmail(booking.getRenter().getEmail())
                .vehicleId(booking.getVehicle().getId())
                .vehicleName(booking.getVehicle().getName())
                .licensePlate(booking.getVehicle().getLicensePlate())
                .stationId(booking.getStation().getId())
                .stationName(booking.getStation().getName())
                .startTime(booking.getStartTime())
                .expectedEndTime(booking.getExpectedEndTime())
                .actualEndTime(booking.getActualEndTime())
                .status(booking.getStatus() != null ? booking.getStatus().toString() : null)
                .checkedOutById(booking.getCheckedOutBy() != null ? booking.getCheckedOutBy().getId() : null)
                .checkedOutByName(booking.getCheckedOutBy() != null ? booking.getCheckedOutBy().getFullName() : null)
                .checkedInById(booking.getCheckedInBy() != null ? booking.getCheckedInBy().getId() : null)
                .checkedInByName(booking.getCheckedInBy() != null ? booking.getCheckedInBy().getFullName() : null)
                .basePrice(booking.getBasePrice())
                .depositPaid(booking.getDepositPaid())
                .extraFee(booking.getExtraFee())
                .totalAmount(booking.getTotalAmount())
                .pickupNote(booking.getPickupNote())
                .returnNote(booking.getReturnNote())
                .paymentStatus(booking.getPaymentStatus() != null ? booking.getPaymentStatus().toString() : null)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    public BookingDetailResponse toDetailResponse(Booking booking) {
        Long durationHours = null;
        if (booking.getStartTime() != null && booking.getExpectedEndTime() != null) {
            durationHours = Duration.between(booking.getStartTime(), booking.getExpectedEndTime()).toHours();
        }

        VehicleDetailResponse vehicleDetail = VehicleDetailResponse.builder()
                .id(booking.getVehicle().getId())
                .stationId(booking.getVehicle().getStation().getId())
                .stationName(booking.getVehicle().getStation().getName())
                .licensePlate(booking.getVehicle().getLicensePlate())
                .name(booking.getVehicle().getName())
                .brand(booking.getVehicle().getBrand())
                .color(booking.getVehicle().getColor())
                .fuelType(booking.getVehicle().getFuelType() != null ? booking.getVehicle().getFuelType().toString() : null)
                .rating(booking.getVehicle().getRating() != null ? java.math.BigDecimal.valueOf(booking.getVehicle().getRating()) : null)
                .capacity(booking.getVehicle().getCapacity())
                .rentCount(booking.getVehicle().getRentCount())
                .photos(booking.getVehicle().getPhotos())
                .status(booking.getVehicle().getStatus() != null ? booking.getVehicle().getStatus().toString() : null)
                .hourlyRate(booking.getVehicle().getHourlyRate())
                .dailyRate(booking.getVehicle().getDailyRate())
                .depositAmount(booking.getVehicle().getDepositAmount())
                .isAvailable(booking.getVehicle().getStatus() != null)
                .createdAt(booking.getVehicle().getCreatedAt())
                .updatedAt(booking.getVehicle().getUpdatedAt())
                .build();

        return BookingDetailResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .renter(UserMapper.fromEntity(booking.getRenter()))
                .vehicle(vehicleDetail)
                .station(stationMapper.toResponse(booking.getStation()))
                .startTime(booking.getStartTime())
                .expectedEndTime(booking.getExpectedEndTime())
                .actualEndTime(booking.getActualEndTime())
                .status(booking.getStatus() != null ? booking.getStatus().toString() : null)
                .checkedOutBy(booking.getCheckedOutBy() != null ? UserMapper.fromEntity(booking.getCheckedOutBy()) : null)
                .checkedInBy(booking.getCheckedInBy() != null ? UserMapper.fromEntity(booking.getCheckedInBy()) : null)
                .basePrice(booking.getBasePrice())
                .depositPaid(booking.getDepositPaid())
                .extraFee(booking.getExtraFee())
                .totalAmount(booking.getTotalAmount())
                .pickupNote(booking.getPickupNote())
                .returnNote(booking.getReturnNote())
                .paymentStatus(booking.getPaymentStatus() != null ? booking.getPaymentStatus().toString() : null)
                .durationHours(durationHours)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
