package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.request.MoMoCallbackRequest;
import com.project.evrental.domain.dto.response.PaymentResponse;
import com.project.evrental.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {

    PaymentService paymentService;

    @PostMapping("/momo/callback")
    public ResponseEntity<ApiResponse<Void>> handleMoMoCallback(
            @RequestBody MoMoCallbackRequest callback
    ) {
        log.info("Received MoMo callback - orderId: {}", callback.getOrderId());
        paymentService.processMoMoCallback(callback);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .statusCode(200)
                        .message("Callback processed successfully")
                        .build());
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @PathVariable UUID paymentId
    ) {
        log.info("Request to get payment: {}", paymentId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PaymentResponse>builder()
                        .statusCode(200)
                        .data(paymentService.getPaymentById(paymentId))
                        .build());
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByBookingId(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to get payments for booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<PaymentResponse>>builder()
                        .statusCode(200)
                        .data(paymentService.getPaymentsByBookingId(bookingId))
                        .build());
    }

    @GetMapping("/transaction/{transactionId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByTransactionId(
            @PathVariable String transactionId
    ) {
        log.info("Request to get payment by transaction ID: {}", transactionId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<PaymentResponse>builder()
                        .statusCode(200)
                        .data(paymentService.getPaymentByTransactionId(transactionId))
                        .build());
    }

    @GetMapping("/result")
    public ResponseEntity<String> result() {
        return ResponseEntity.status(HttpStatus.OK).body("Payment successful!");
    }
}
