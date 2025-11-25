package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.BookingResponse;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.domain.dto.response.admin.*;
import com.project.evrental.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ==================== Dashboard Summary ====================
    
    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<AdminDashboardSummaryResponse>> getDashboardSummary() {
        AdminDashboardSummaryResponse data = adminService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.<AdminDashboardSummaryResponse>builder()
                .statusCode(200)
                .message("Dashboard summary retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/revenue-chart")
    public ResponseEntity<ApiResponse<List<RevenueAndBookingInChartResponse>>> getRevenueChart() {
        List<RevenueAndBookingInChartResponse> data = adminService.getRevenueAndBookingChart();
        return ResponseEntity.ok(ApiResponse.<List<RevenueAndBookingInChartResponse>>builder()
                .statusCode(200)
                .message("Revenue chart data retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/vehicle-status")
    public ResponseEntity<ApiResponse<VehicleStatusDistributionResponse>> getVehicleStatus() {
        VehicleStatusDistributionResponse data = adminService.getVehicleStatusDistribution();
        return ResponseEntity.ok(ApiResponse.<VehicleStatusDistributionResponse>builder()
                .statusCode(200)
                .message("Vehicle status distribution retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/booking-by-type")
    public ResponseEntity<ApiResponse<List<BookingByTypeResponse>>> getBookingByType() {
        List<BookingByTypeResponse> data = adminService.getBookingByType();
        return ResponseEntity.ok(ApiResponse.<List<BookingByTypeResponse>>builder()
                .statusCode(200)
                .message("Booking by type retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/new-bookings")
    public ResponseEntity<ApiResponse<List<NewBookingResponse>>> getNewBookings() {
        List<NewBookingResponse> data = adminService.getNewBookings();
        return ResponseEntity.ok(ApiResponse.<List<NewBookingResponse>>builder()
                .statusCode(200)
                .message("New bookings retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/booking-performance")
    public ResponseEntity<ApiResponse<BookingPerformanceResponse>> getBookingPerformance() {
        BookingPerformanceResponse data = adminService.getBookingPerformance();
        return ResponseEntity.ok(ApiResponse.<BookingPerformanceResponse>builder()
                .statusCode(200)
                .message("Booking performance retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/dashboard/maintenance-overview")
    public ResponseEntity<ApiResponse<MaintenanceOverviewResponse>> getMaintenanceOverview() {
        MaintenanceOverviewResponse data = adminService.getMaintenanceOverview();
        return ResponseEntity.ok(ApiResponse.<MaintenanceOverviewResponse>builder()
                .statusCode(200)
                .message("Maintenance overview retrieved successfully")
                .data(data)
                .build());
    }

    // ==================== User Management ====================
    
    @GetMapping("/users/metrics")
    public ResponseEntity<ApiResponse<MetricUserManagementResponse>> getUserMetrics() {
        MetricUserManagementResponse data = adminService.getMetricUserManagement();
        return ResponseEntity.ok(ApiResponse.<MetricUserManagementResponse>builder()
                .statusCode(200)
                .message("User metrics retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/users/filter")
    public ResponseEntity<ApiResponse<List<UserResponse>>> filterUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean verification
    ) {
        List<UserResponse> data = adminService.filterUsers(name, email, phone, role, verification);
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Users filtered successfully")
                .data(data)
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersTable() {
        List<UserResponse> data = adminService.getUsersTable();
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Users table retrieved successfully")
                .data(data)
                .build());
    }

    // ==================== Vehicle Management ====================
    
    @GetMapping("/vehicles/metrics")
    public ResponseEntity<ApiResponse<MetricVehicleManagementResponse>> getVehicleMetrics() {
        MetricVehicleManagementResponse data = adminService.getMetricVehicleManagement();
        return ResponseEntity.ok(ApiResponse.<MetricVehicleManagementResponse>builder()
                .statusCode(200)
                .message("Vehicle metrics retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/vehicles/search")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> searchVehicles(
            @RequestParam(required = false) String keyword
    ) {
        List<VehicleResponse> data = adminService.searchVehicles(keyword);
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder()
                .statusCode(200)
                .message("Vehicles searched successfully")
                .data(data)
                .build());
    }

    @GetMapping("/vehicles/filter")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> filterVehicles(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity
    ) {
        List<VehicleResponse> data = adminService.filterVehicles(name, status, type, capacity);
        return ResponseEntity.ok(ApiResponse.<List<VehicleResponse>>builder()
                .statusCode(200)
                .message("Vehicles filtered successfully")
                .data(data)
                .build());
    }

    // ==================== Booking Management ====================
    
    @GetMapping("/bookings/metrics")
    public ResponseEntity<ApiResponse<MetricBookingDashboardResponse>> getBookingMetrics() {
        MetricBookingDashboardResponse data = adminService.getMetricBookingDashboard();
        return ResponseEntity.ok(ApiResponse.<MetricBookingDashboardResponse>builder()
                .statusCode(200)
                .message("Booking metrics retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsTable() {
        List<BookingResponse> data = adminService.getBookingsTable();
        return ResponseEntity.ok(ApiResponse.<List<BookingResponse>>builder()
                .statusCode(200)
                .message("Bookings table retrieved successfully")
                .data(data)
                .build());
    }

    // ==================== Revenue & Analytics ====================
    
    @GetMapping("/revenue/yearly-comparison")
    public ResponseEntity<ApiResponse<YearlyRevenueComparisonResponse>> getYearlyRevenueComparison() {
        YearlyRevenueComparisonResponse data = adminService.getYearlyRevenueComparison();
        return ResponseEntity.ok(ApiResponse.<YearlyRevenueComparisonResponse>builder()
                .statusCode(200)
                .message("Yearly revenue comparison retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/revenue/by-year")
    public ResponseEntity<ApiResponse<List<RevenueByYearResponse>>> getRevenueByYear(
            @RequestParam(required = false, defaultValue = "5") Integer numberOfYears
    ) {
        List<RevenueByYearResponse> data = adminService.getRevenueByYear(numberOfYears);
        return ResponseEntity.ok(ApiResponse.<List<RevenueByYearResponse>>builder()
                .statusCode(200)
                .message("Revenue by year retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/revenue/detail")
    public ResponseEntity<ApiResponse<DetailRevenueResponse>> getDetailRevenue() {
        DetailRevenueResponse data = adminService.getDetailRevenue();
        return ResponseEntity.ok(ApiResponse.<DetailRevenueResponse>builder()
                .statusCode(200)
                .message("Detail revenue retrieved successfully")
                .data(data)
                .build());
    }

    // ==================== Top Performers ====================
    
    @GetMapping("/top-vehicles")
    public ResponseEntity<ApiResponse<List<TopVehicleResponse>>> getTopVehicles(
            @RequestParam(required = false, defaultValue = "8") Integer limit
    ) {
        List<TopVehicleResponse> data = adminService.getTopVehicles(limit);
        return ResponseEntity.ok(ApiResponse.<List<TopVehicleResponse>>builder()
                .statusCode(200)
                .message("Top vehicles retrieved successfully")
                .data(data)
                .build());
    }

    @GetMapping("/top-customers")
    public ResponseEntity<ApiResponse<List<TopCustomerResponse>>> getTopCustomers(
            @RequestParam(required = false, defaultValue = "8") Integer limit
    ) {
        List<TopCustomerResponse> data = adminService.getTopCustomers(limit);
        return ResponseEntity.ok(ApiResponse.<List<TopCustomerResponse>>builder()
                .statusCode(200)
                .message("Top customers retrieved successfully")
                .data(data)
                .build());
    }

    // ==================== Staff Management ====================
    
    @PostMapping("/staff/attach-to-station")
    public ResponseEntity<ApiResponse<String>> attachStaffToStation(
            @RequestParam UUID staffId,
            @RequestParam UUID stationId
    ) {
        adminService.attachStaffToStation(staffId, stationId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .statusCode(200)
                .message("Staff attached to station successfully")
                .data("Staff has been assigned to the station")
                .build());
    }
}
