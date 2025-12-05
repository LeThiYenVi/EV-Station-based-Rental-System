package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.dto.request.CreateVehicleRequest;
import com.project.evrental.domain.dto.request.UpdateVehicleRequest;
import com.project.evrental.domain.dto.response.VehicleDetailResponse;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleController {

    VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(
            @Valid @RequestBody CreateVehicleRequest request
    ) {
        log.info("Request to create vehicle: {}", request.getLicensePlate());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<VehicleResponse>builder()
                        .statusCode(201)
                        .message("Vehicle created successfully")
                        .data(vehicleService.createVehicle(request))
                        .build());
    }

    @PutMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable UUID vehicleId,
            @Valid @RequestBody UpdateVehicleRequest request
    ) {
        log.info("Request to update vehicle: {}", vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleResponse>builder()
                        .statusCode(200)
                        .message("Vehicle updated successfully")
                        .data(vehicleService.updateVehicle(vehicleId, request))
                        .build());
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<VehicleDetailResponse>> getVehicleById(
            @PathVariable UUID vehicleId
    ) {
        log.info("Request to get vehicle detail: {}", vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleDetailResponse>builder()
                        .statusCode(200)
                        .data(vehicleService.getVehicleDetailById(vehicleId))
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get all vehicles - page: {}, size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getAllVehicles(pageable))
                        .build());
    }

    @GetMapping("/station/{stationId}")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehiclesByStationId(
            @PathVariable UUID stationId
    ) {
        log.info("Request to get vehicles for station: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getVehiclesByStationId(stationId))
                        .build());
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAvailableVehicles(
            @RequestParam UUID stationId,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String brand
    ) {
        log.info("Request to get available vehicles - station: {}, fuelType: {}, brand: {}", 
                stationId, fuelType, brand);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getAvailableVehicles(stationId, fuelType, brand))
                        .build());
    }

    @GetMapping("/available/booking")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getTrulyAvailableVehicles(
            @RequestParam UUID stationId,
            @RequestParam(required = false) String fuelType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime
    ) {
        log.info("Request to get truly available vehicles for booking - station: {}, period: {} to {}", 
                stationId, startTime, endTime);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getTrulyAvailableVehicles(stationId, fuelType, startTime, endTime))
                        .build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehiclesByStatus(
            @PathVariable VehicleStatus status
    ) {
        log.info("Request to get vehicles by status: {}", status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getVehiclesByStatus(status))
                        .build());
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehiclesByBrand(
            @PathVariable String brand
    ) {
        log.info("Request to get vehicles by brand: {}", brand);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<VehicleResponse>>builder()
                        .statusCode(200)
                        .data(vehicleService.getVehiclesByBrand(brand))
                        .build());
    }

    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteVehicle(
            @PathVariable UUID vehicleId
    ) {
        log.info("Request to delete vehicle: {}", vehicleId);
        vehicleService.deleteVehicle(vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .message("Vehicle deleted successfully")
                        .build());
    }

    @PatchMapping("/{vehicleId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<VehicleResponse>> changeVehicleStatus(
            @PathVariable UUID vehicleId,
            @RequestParam VehicleStatus status
    ) {
        log.info("Request to change vehicle status to {} for ID: {}", status, vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleResponse>builder()
                        .statusCode(200)
                        .message("Vehicle status changed successfully")
                        .data(vehicleService.changeVehicleStatus(vehicleId, status))
                        .build());
    }

    @PatchMapping("/{vehicleId}/rent-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<VehicleResponse>> incrementRentCount(
            @PathVariable UUID vehicleId
    ) {
        log.info("Request to increment rent count for vehicle: {}", vehicleId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleResponse>builder()
                        .statusCode(200)
                        .message("Rent count incremented successfully")
                        .data(vehicleService.incrementRentCount(vehicleId))
                        .build());
    }

    @PostMapping(value = "/{vehicleId}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Upload vehicle photos", description = "Upload multiple photos for a vehicle")
    public ResponseEntity<ApiResponse<VehicleResponse>> uploadVehiclePhotos(
            @PathVariable UUID vehicleId,
            @Parameter(description = "Multiple image files to upload", required = true)
            @RequestPart("files") List<MultipartFile> files
    ) {
        log.info("Request to upload photos for vehicle: {}", vehicleId);
        MultipartFile[] fileArray = files.toArray(new MultipartFile[0]);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<VehicleResponse>builder()
                        .statusCode(200)
                        .message("Vehicle photos uploaded successfully")
                        .data(vehicleService.uploadVehiclePhotos(vehicleId, fileArray))
                        .build());
    }
}
