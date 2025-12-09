package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.dto.request.CreateBookingRequest;
import com.project.evrental.domain.dto.request.UpdateBookingRequest;
import com.project.evrental.domain.dto.response.BookingDetailResponse;
import com.project.evrental.domain.dto.response.BookingResponse;
import com.project.evrental.domain.dto.response.BookingWithPaymentResponse;
import com.project.evrental.domain.dto.response.MoMoPaymentResponse;
import com.project.evrental.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {

    BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ApiResponse<BookingWithPaymentResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request
    ) {
        log.info("Request to create booking for vehicle: {}", request.getVehicleId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BookingWithPaymentResponse>builder()
                        .statusCode(201)
                        .message("Booking created successfully")
                        .data(bookingService.createBooking(request))
                        .build());
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("hasRole('RENTER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDetailResponse>> getBookingById(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to get booking detail: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingDetailResponse>builder()
                        .statusCode(200)
                        .data(bookingService.getBookingDetailById(bookingId))
                        .build());
    }

    @GetMapping("/code/{bookingCode}")
    @PreAuthorize("hasRole('RENTER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDetailResponse>> getBookingByCode(
            @PathVariable String bookingCode
    ) {
        log.info("Request to get booking detail by code: {}", bookingCode);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingDetailResponse>builder()
                        .statusCode(200)
                        .data(bookingService.getBookingDetailByCode(bookingCode))
                        .build());
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get all bookings - page: {}, size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<BookingResponse>>builder()
                        .statusCode(200)
                        .data(bookingService.getAllBookings(pageable))
                        .build());
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('RENTER')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings() {
        log.info("Request to get my bookings");
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BookingResponse>>builder()
                        .statusCode(200)
                        .data(bookingService.getMyBookings())
                        .build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByStatus(
            @PathVariable BookingStatus status
    ) {
        log.info("Request to get bookings by status: {}", status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BookingResponse>>builder()
                        .statusCode(200)
                        .data(bookingService.getBookingsByStatus(status))
                        .build());
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByVehicleId(
            @PathVariable UUID vehicleId
    ) {
        log.info("Request to get bookings for vehicle: {}", vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BookingResponse>>builder()
                        .statusCode(200)
                        .data(bookingService.getBookingsByVehicleId(vehicleId))
                        .build());
    }

    @GetMapping("/station/{stationId}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByStationId(
            @PathVariable UUID stationId
    ) {
        log.info("Request to get bookings for station: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BookingResponse>>builder()
                        .statusCode(200)
                        .data(bookingService.getBookingsByStationId(stationId))
                        .build());
    }

    @PutMapping("/{bookingId}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(
            @PathVariable UUID bookingId,
            @Valid @RequestBody UpdateBookingRequest request
    ) {
        log.info("Request to update booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingResponse>builder()
                        .statusCode(200)
                        .message("Booking updated successfully")
                        .data(bookingService.updateBooking(bookingId, request))
                        .build());
    }

    @PatchMapping("/{bookingId}/confirm")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to confirm booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingResponse>builder()
                        .statusCode(200)
                        .message("Booking confirmed successfully")
                        .data(bookingService.confirmBooking(bookingId))
                        .build());
    }

    @PatchMapping("/{bookingId}/start")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> startBooking(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to start booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingResponse>builder()
                        .statusCode(200)
                        .message("Booking started successfully")
                        .data(bookingService.startBooking(bookingId))
                        .build());
    }

    @PatchMapping("/{bookingId}/complete")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingWithPaymentResponse>> completeBooking(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to complete booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingWithPaymentResponse>builder()
                        .statusCode(200)
                        .message("Booking completed successfully")
                        .data(bookingService.completeBooking(bookingId))
                        .build());
    }

    @PatchMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('RENTER') or hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to cancel booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BookingResponse>builder()
                        .statusCode(200)
                        .message("Booking cancelled successfully")
                        .data(bookingService.cancelBooking(bookingId))
                        .build());
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to delete booking: {}", bookingId);
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .statusCode(200)
                        .message("Booking deleted successfully")
                        .build());
    }
    @GetMapping("/{bookingId}/payRemainder")
    @PreAuthorize("hasRole('RENTER')")
    @Operation(summary = "Pay the Reminder ", description = "Pay the remaining amount for a booking")
    public ResponseEntity<ApiResponse<MoMoPaymentResponse>> payRemainder(
            @PathVariable UUID bookingId
    ) {
        log.info("Request to purchase booking: {}", bookingId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<MoMoPaymentResponse>builder()
                        .statusCode(200)
                        .message("Booking purchased successfully")
                        .data(bookingService.payRemainder(bookingId))
                        .build());
    }
}
