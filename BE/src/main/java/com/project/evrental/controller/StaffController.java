package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.Booking;
import com.project.evrental.domain.entity.User;
import com.project.evrental.service.UserService;
import com.project.evrental.service.staff.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final UserService userService;
    private final StaffService staffService;

    @GetMapping("/by-station")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> staffByStation(@RequestParam UUID stationId) {
        var data = userService.getStaffByStation(stationId);
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder().statusCode(200).data(data).build());
    }

    /**
     * Staff confirms a pending booking
     * POST /api/staff/bookings/{bookingId}/confirm
     */
    @PostMapping("/bookings/{bookingId}/confirm")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<Booking>> confirmBooking(
            @PathVariable UUID bookingId,
            @RequestParam UUID staffId
    ) {
        Booking booking = staffService.confirmBooking(bookingId, staffId);
        return ResponseEntity.ok(ApiResponse.<Booking>builder()
                .statusCode(200)
                .message("Booking confirmed successfully")
                .data(booking)
                .build());
    }

    /**
     * Staff verifies user's license
     * POST /api/staff/users/{userId}/verify-license
     */
    @PostMapping("/users/{userId}/verify-license")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<User>> verifyUserLicense(
            @PathVariable UUID userId,
            @RequestParam UUID staffId,
            @RequestParam boolean approved
    ) {
        User user = staffService.verifyUserLicense(userId, staffId, approved);
        return ResponseEntity.ok(ApiResponse.<User>builder()
                .statusCode(200)
                .message(approved ? "User license verified successfully" : "User license verification rejected")
                .data(user)
                .build());
    }

    /**
     * Staff rejects/revokes user's license verification
     * POST /api/staff/users/{userId}/reject-license
     */
    @PostMapping("/users/{userId}/reject-license")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> rejectUserLicense(
            @PathVariable UUID userId
    ) {
        UserResponse user = userService.rejectLicenseVerification(userId);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("User license verification rejected successfully")
                .data(user)
                .build());
    }
}
