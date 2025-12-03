package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.common.StationStatus;
import com.project.evrental.domain.dto.request.CreateStationRequest;
import com.project.evrental.domain.dto.request.UpdateStationRequest;
import com.project.evrental.domain.dto.response.StationDetailResponse;
import com.project.evrental.domain.dto.response.StationResponse;
import com.project.evrental.service.StationService;
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
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StationController {

    StationService stationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StationResponse>> createStation(
            @Valid @RequestBody CreateStationRequest request
    ) {
        log.info("Request to create station: {}", request.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<StationResponse>builder()
                        .statusCode(201)
                        .message("Station created successfully")
                        .data(stationService.createStation(request))
                        .build());
    }

    @PutMapping("/{stationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StationResponse>> updateStation(
            @PathVariable UUID stationId,
            @Valid @RequestBody UpdateStationRequest request
    ) {
        log.info("Request to update station: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StationResponse>builder()
                        .statusCode(200)
                        .message("Station updated successfully")
                        .data(stationService.updateStation(stationId, request))
                        .build());
    }

    @GetMapping("/{stationId}")
    public ResponseEntity<ApiResponse<StationDetailResponse>> getStationById(
            @PathVariable UUID stationId
    ) {
        log.info("Request to get station detail: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StationDetailResponse>builder()
                        .statusCode(200)
                        .data(stationService.getStationDetailById(stationId))
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StationResponse>>> getAllStations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get all stations - page: {}, size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<StationResponse>>builder()
                        .statusCode(200)
                        .data(stationService.getAllStations(pageable))
                        .build());
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<StationResponse>>> getActiveStations() {
        log.info("Request to get all active stations");
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<StationResponse>>builder()
                        .statusCode(200)
                        .data(stationService.getActiveStations())
                        .build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<StationResponse>>> getStationsByStatus(
            @PathVariable StationStatus status
    ) {
        log.info("Request to get stations by status: {}", status);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<StationResponse>>builder()
                        .statusCode(200)
                        .data(stationService.getStationsByStatus(status))
                        .build());
    }

    @DeleteMapping("/{stationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteStation(
            @PathVariable UUID stationId
    ) {
        log.info("Request to delete station: {}", stationId);
        stationService.deleteStation(stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.builder()
                        .statusCode(204)
                        .message("Station deleted successfully")
                        .build());
    }

    @PatchMapping("/{stationId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StationResponse>> changeStationStatus(
            @PathVariable UUID stationId,
            @RequestParam StationStatus status
    ) {
        log.info("Request to change station status to {} for ID: {}", status, stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StationResponse>builder()
                        .statusCode(200)
                        .message("Station status changed successfully")
                        .data(stationService.changeStationStatus(stationId, status))
                        .build());
    }

    @GetMapping("/{stationId}/vehicles/available/count")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getAvailableVehiclesCount(
            @PathVariable UUID stationId
    ) {
        log.info("Request to get available vehicles count for station: {}", stationId);
        Integer count = stationService.getAvailableVehiclesCount(stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Map<String, Integer>>builder()
                        .statusCode(200)
                        .data(Map.of("availableVehicles", count))
                        .build());
    }

    @PostMapping(value = "/{stationId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<StationResponse>> uploadStationPhoto(
            @PathVariable UUID stationId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Request to upload photo for station: {}", stationId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<StationResponse>builder()
                        .statusCode(200)
                        .message("Station photo uploaded successfully")
                        .data(stationService.uploadStationPhoto(stationId, file))
                        .build());
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<StationResponse>>> getFeaturedStations(
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Request to get {} featured stations", limit);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<StationResponse>>builder()
                        .statusCode(200)
                        .data(stationService.getFeaturedStations(limit))
                        .build());
    }
}
