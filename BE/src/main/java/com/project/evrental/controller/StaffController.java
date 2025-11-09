package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> staffByStation(@RequestParam UUID stationId) {
        var data = userService.getStaffByStation(stationId);
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder().statusCode(200).data(data).build());
    }
}
