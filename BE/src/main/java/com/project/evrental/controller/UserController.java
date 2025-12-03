package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.common.UserRole;
import com.project.evrental.domain.dto.request.UpdateUserRequest;
import com.project.evrental.domain.dto.request.UpdateUserRoleRequest;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.service.UserService;
import com.project.evrental.service.auth.CognitoService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    CognitoService cognitoService;
    UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('RENTER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(
            @RequestHeader("Authorization") String authorization
    ) {
        String accessToken = extractToken(authorization);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .data(cognitoService.getUserInfo(accessToken))
                        .build());
    }

    @GetMapping("/me/stats")
    @PreAuthorize("hasRole('RENTER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfoWithStats(
            @RequestHeader("Authorization") String authorization
    ) {
        String accessToken = extractToken(authorization);
        UserResponse basicUserInfo = cognitoService.getUserInfo(accessToken);
        
        log.info("Request to get current user info with booking statistics: {}", basicUserInfo.getId());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .data(userService.getUserByIdWithStats(basicUserInfo.getId()))
                        .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get all users - Page: {}, Size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<UserResponse>>builder()
                        .statusCode(200)
                        .data(userService.getAllUsersPaged(pageable))
                        .build());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable UUID userId
    ) {
        log.info("Request to get user: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .data(userService.getUserById(userId))
                        .build());
    }

    @GetMapping("/{userId}/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByIdWithStats(
            @PathVariable UUID userId
    ) {
        log.info("Request to get user with booking statistics: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .data(userService.getUserByIdWithStats(userId))
                        .build());
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(
            @PathVariable UserRole role
    ) {
        log.info("Request to get users by role: {}", role);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<UserResponse>>builder()
                        .statusCode(200)
                        .data(userService.getUsersByRole(role))
                        .build());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('RENTER')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        log.info("Request to update user: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("User updated successfully")
                        .data(userService.updateUser(userId, request))
                        .build());
    }

    @PatchMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        log.info("Request to update user role: {} to {}", userId, request.getRole());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("User role updated successfully")
                        .data(userService.updateUserRole(userId, request.getRole()))
                        .build());
    }

    @PatchMapping("/{userId}/verify-license")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<UserResponse>> verifyUserLicense(
            @PathVariable UUID userId
    ) {
        log.info("Request to verify user license: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("User license verified successfully")
                        .data(userService.verifyLicenceUserAccount(userId))
                        .build());
    }

    @PostMapping(value = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('RENTER')")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            @PathVariable UUID userId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Request to upload avatar for user: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("Avatar uploaded successfully")
                        .data(userService.uploadAvatar(userId, file))
                        .build());
    }

    @PostMapping(value = "/{userId}/license-card/front", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('RENTER')")
    public ResponseEntity<ApiResponse<UserResponse>> uploadLicenseCardFront(
            @PathVariable UUID userId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Request to upload license card front for user: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("License card front uploaded successfully")
                        .data(userService.uploadLicenseCardFront(userId, file))
                        .build());
    }

    @PostMapping(value = "/{userId}/license-card/back", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('RENTER')")
    public ResponseEntity<ApiResponse<UserResponse>> uploadLicenseCardBack(
            @PathVariable UUID userId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Request to upload license card back for user: {}", userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .message("License card back uploaded successfully")
                        .data(userService.uploadLicenseCardBack(userId, file))
                        .build());
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable UUID userId
    ) {
        log.info("Request to delete user: {}", userId);
        userService.deleteUser(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .statusCode(200)
                        .message("User deleted successfully")
                        .build());
    }

    private String extractToken(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        throw new IllegalArgumentException("Invalid authorization header");
    }

}
