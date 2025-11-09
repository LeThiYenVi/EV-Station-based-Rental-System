package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.*;
import com.project.evrental.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue-by-station")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RevenueByStationResponse>>> revenueByStation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) UUID stationId
    ) {
        List<RevenueByStationResponse> data = reportService.revenueByStation(start, end, stationId);
        return ResponseEntity.ok(ApiResponse.<List<RevenueByStationResponse>>builder()
                .statusCode(200).message("OK").data(data).build());
    }

    @GetMapping("/utilization")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UtilizationResponse>>> utilization(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) UUID stationId
    ) {
        List<UtilizationResponse> data = reportService.utilization(start, end, stationId);
        return ResponseEntity.ok(ApiResponse.<List<UtilizationResponse>>builder()
                .statusCode(200).message("OK").data(data).build());
    }

    @GetMapping("/peak-hours")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PeakHourResponse>>> peakHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) UUID stationId
    ) {
        List<PeakHourResponse> data = reportService.peakHours(start, end, stationId);
        return ResponseEntity.ok(ApiResponse.<List<PeakHourResponse>>builder()
                .statusCode(200).message("OK").data(data).build());
    }

    @GetMapping("/staff-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<StaffPerformanceResponse>>> staffPerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) UUID stationId
    ) {
        List<StaffPerformanceResponse> data = reportService.staffPerformance(start, end, stationId);
        return ResponseEntity.ok(ApiResponse.<List<StaffPerformanceResponse>>builder()
                .statusCode(200).message("OK").data(data).build());
    }

    @GetMapping("/customer-risk")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<CustomerRiskResponse>>> customerRisk(
            @RequestParam(defaultValue = "3") int minBookings
    ) {
        List<CustomerRiskResponse> data = reportService.customerRiskList(minBookings);
        return ResponseEntity.ok(ApiResponse.<List<CustomerRiskResponse>>builder()
                .statusCode(200).message("OK").data(data).build());
    }
}
