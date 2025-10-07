package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.service.auth.CognitoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    CognitoService cognitoService;


    @GetMapping("/me")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(
            @RequestHeader("Authorization") String authorization
    ) {
        String accessToken = extractToken(authorization);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .statusCode(200)
                        .data(cognitoService.getUserInfo(accessToken)).build());
    }

    private String extractToken(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        throw new IllegalArgumentException("Invalid authorization header");
    }

}
