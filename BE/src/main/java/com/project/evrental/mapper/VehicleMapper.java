package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.AvailableVehicleSummary;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.domain.entity.Vehicle;

public class VehicleMapper {

    private VehicleMapper() {}

    public static AvailableVehicleSummary mapToSummary(Vehicle vehicle) {
        return AvailableVehicleSummary.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .capacity(vehicle.getCapacity())
                .dailyRate(vehicle.getDailyRate())
                .depositAmount(vehicle.getDepositAmount())
                .fuelType(vehicle.getFuelType().toString())
                .name(vehicle.getName())
                .licensePlate(vehicle.getLicensePlate())
                .rating(vehicle.getRating())
                .photos(vehicle.getPhotos())
                .rentCount(vehicle.getRentCount())
                .hourlyRate(vehicle.getHourlyRate())
                .build();
    }

    public static VehicleResponse toResponse(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .stationId(vehicle.getStation() != null ? vehicle.getStation().getId() : null)
                .licensePlate(vehicle.getLicensePlate())
                .name(vehicle.getName())
                .brand(vehicle.getBrand())
                .color(vehicle.getColor())
                .fuelType(vehicle.getFuelType() != null ? vehicle.getFuelType().toString() : null)
                .rating(vehicle.getRating() != null ? java.math.BigDecimal.valueOf(vehicle.getRating()) : null)
                .capacity(vehicle.getCapacity())
                .rentCount(vehicle.getRentCount())
                .photos(vehicle.getPhotos())
                .status(vehicle.getStatus() != null ? vehicle.getStatus().toString() : null)
                .hourlyRate(vehicle.getHourlyRate())
                .dailyRate(vehicle.getDailyRate())
                .depositAmount(vehicle.getDepositAmount())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }

}
