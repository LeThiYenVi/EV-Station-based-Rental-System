package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.VehicleHistoryItemResponse;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.service.FleetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/fleet")
@RequiredArgsConstructor
public class FleetController {

    private final FleetService fleetService;

    @GetMapping("/stations/{stationId}/vehicles")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> vehiclesAtStation(@PathVariable UUID stationId) {
        List<VehicleResponse> list = fleetService.vehiclesAtStation(stationId);
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder().statusCode(200).data(list).build());
    }

    @GetMapping("/stations/{stationId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<FleetService.VehicleStatusSummary>> statusSummary(@PathVariable UUID stationId) {
        var summary = fleetService.getStatusSummary(stationId);
        return ResponseEntity.ok(ApiResponse.<FleetService.VehicleStatusSummary>builder().statusCode(200).data(summary).build());
    }

    @GetMapping("/vehicles/{vehicleId}/history")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<VehicleHistoryItemResponse>>> vehicleHistory(@PathVariable UUID vehicleId) {
        var history = fleetService.vehicleHistory(vehicleId).stream().map(b -> VehicleHistoryItemResponse.builder()
                .bookingId(b.getId())
                .bookingCode(b.getBookingCode())
                .startTime(b.getStartTime())
                .expectedEndTime(b.getExpectedEndTime())
                .actualEndTime(b.getActualEndTime())
                .status(b.getStatus().name())
                .renterId(b.getRenter().getId())
                .checkedOutBy(b.getCheckedOutBy().getId())
                .checkedInBy(b.getCheckedInBy() == null ? null : b.getCheckedInBy().getId())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<VehicleHistoryItemResponse>>builder().statusCode(200).data(history).build());
    }

    @GetMapping("/stations/{stationId}/dispatchable")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')") // Liệt kê các xe thực sự rảnh (không trùng lịch) để điều phối trong khoảng thời gian.
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> dispatchableVehicles(@PathVariable UUID stationId,
                                                                                   @RequestParam LocalDateTime start,
                                                                                   @RequestParam LocalDateTime end) {
        var list = fleetService.dispatchableVehicles(stationId, start, end).stream().map(v -> VehicleResponse.builder()
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
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder().statusCode(200).data(list).build());
    }
}
