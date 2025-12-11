package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.request.NearbyStationSearchRequest;
import com.project.evrental.domain.dto.response.NearbyStationsPageResponse;
import com.project.evrental.service.search.LocationSearchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationSearchController {

    LocationSearchService locationSearchService;

    @GetMapping("/stations/nearby")
    public ResponseEntity<ApiResponse<NearbyStationsPageResponse>> findNearbyStations(
            @RequestParam BigDecimal latitude,
            @RequestParam BigDecimal longitude,
            @RequestParam(required = false, defaultValue = "5.0") Double radiusKm,
            @RequestParam(required = false, defaultValue = "10") Integer limit,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) LocalDateTime startTime,
            @RequestParam(required = false) LocalDateTime endTime
    ) {
        NearbyStationSearchRequest request = NearbyStationSearchRequest.builder()
                .latitude(latitude)
                .longitude(longitude)
                .radiusKm(radiusKm)
                .limit(limit)
                .minRating(minRating)
                .fuelType(fuelType)
                .brand(brand)
                .startTime(startTime)
                .endTime(endTime)
                .build();

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<NearbyStationsPageResponse>builder()
                        .statusCode(200)
                        .data(locationSearchService.findNearbyStations(request))
                        .build());
    }

}
