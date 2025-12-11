package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.AuthResponse;
import com.project.evrental.domain.dto.request.*;
import com.project.evrental.domain.dto.response.OauthState;
import com.project.evrental.service.auth.CognitoService;
import com.project.evrental.service.auth.OauthStateService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    CognitoService cognitoService;

    OauthStateService oauthStateService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AuthResponse>builder()
                        .statusCode(200)
                        .message("created user!")
                        .data(cognitoService.register(request))
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        var authResponse = cognitoService.login(request);

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth/refresh")
                .maxAge(Duration.ofDays(30))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<AuthResponse>builder()
                        .statusCode(200)
                        .message("login user successfully!")
                        .data(AuthResponse.builder()
                                .user(authResponse.getUser())
                                .accessToken(authResponse.getAccessToken())
                                .idToken(authResponse.getIdToken())
                                .expiresIn(authResponse.getExpiresIn())
                                .tokenType(authResponse.getTokenType())
                                .build())
                        .build());
    }

    @GetMapping("/login/google")
    public ResponseEntity<ApiResponse<AuthResponse>> handleLoginGoogle(@RequestBody Map<String, String> requestBody,
                                                                          HttpServletResponse response) {
        log.info("Login google callback");
        String code = requestBody.get("code");
        var authResponse = cognitoService.loginWithGoogle(code);
        log.info("{}", authResponse);
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth/refresh")
                .maxAge(Duration.ofDays(30))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<AuthResponse>builder()
                        .statusCode(200)
                        .message("login user successfully!")
                        .data(AuthResponse.builder()
                                .user(authResponse.getUser())
                                .accessToken(authResponse.getAccessToken())
                                .idToken(authResponse.getIdToken())
                                .expiresIn(authResponse.getExpiresIn())
                                .tokenType(authResponse.getTokenType())
                                .build())
                        .build()
                );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody ForgotUserPasswordRequest request) {
        cognitoService.forgotPassword(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody ResetUserPasswordRequest request) {
        cognitoService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword(@RequestBody ChangeUserPasswordRequest request) {
        cognitoService.changePassword(request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@CookieValue(name = "refresh_token") String refreshToken,
                                                             HttpServletResponse response) {
        AuthResponse authResponse = cognitoService.refreshToken(refreshToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/api/auth/refresh")
                .maxAge(Duration.ofDays(30))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<AuthResponse>builder()
                        .statusCode(200)
                        .data(AuthResponse.builder()
                                .user(authResponse.getUser())
                                .accessToken(authResponse.getAccessToken())
                                .idToken(authResponse.getIdToken())
                                .expiresIn(authResponse.getExpiresIn())
                                .tokenType(authResponse.getTokenType())
                                .build())
                        .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@RequestBody String token) {
        cognitoService.logout(token);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .build());
    }

    @PostMapping("/url")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuthorizationUrl() {
        OauthState oauthState = oauthStateService.generateAndSaveState();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Map<String, String>>builder()
                        .statusCode(200)
                        .data(Map.of(
                              "authorizationUrl", cognitoService.getAuthorizationUrlForGoogleProvider(oauthState),
                                "state", oauthState.getState())
                        )
                        .build());
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<?>> confirmAccount(@Valid @RequestBody VerifyAccountRequest request) {
        cognitoService.confirmUser(request);
        log.info("Verification request received for email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .statusCode(200)
                        .message("verified account")
                        .build());
    }
}
