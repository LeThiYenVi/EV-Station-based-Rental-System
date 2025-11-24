package com.project.evrental.service;

import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.repository.BookingRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FleetService {

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    public record VehicleStatusSummary(UUID stationId, long available, long ongoing, long maintenance) {}

    public VehicleStatusSummary getStatusSummary(UUID stationId) {
        long available = vehicleRepository.countByStationIdAndStatus(stationId, VehicleStatus.AVAILABLE);
        long ongoing = vehicleRepository.countByStationIdAndStatus(stationId, VehicleStatus.RENTED);
        long maintenance = vehicleRepository.countByStationIdAndStatus(stationId, VehicleStatus.MAINTENANCE);
        return new VehicleStatusSummary(stationId, available, ongoing, maintenance);
    }

    public List<Booking> vehicleHistory(UUID vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }

    public List<VehicleResponse> vehiclesAtStation(UUID stationId) {
    return vehicleRepository.findByStationId(stationId).stream()
        .map(v -> VehicleResponse.builder()
            .id(v.getId())
            .stationId(stationId)
            .licensePlate(v.getLicensePlate())
            .name(v.getName())
            .brand(v.getBrand())
            .color(v.getColor())
            .fuelType(v.getFuelType() == null ? null : v.getFuelType().name())
            .rating(v.getRating() == null ? null : java.math.BigDecimal.valueOf(v.getRating()))
            .capacity(v.getCapacity())
            .rentCount(v.getRentCount())
            .photos(v.getPhotos())
            .status(v.getStatus() == null ? null : v.getStatus().name())
            .hourlyRate(v.getHourlyRate())
            .dailyRate(v.getDailyRate())
            .depositAmount(v.getDepositAmount())
            .build())
        .collect(Collectors.toList());
    }

    public List<Vehicle> dispatchableVehicles(UUID stationId, LocalDateTime start, LocalDateTime end) {
        return vehicleRepository.findAvailableVehicles(stationId, start, end);
    }
}
