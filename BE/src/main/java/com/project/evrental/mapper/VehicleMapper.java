package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.AvailableVehicleSummary;
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

}
