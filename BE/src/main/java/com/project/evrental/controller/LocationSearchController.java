package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.request.NearbyStationSearchRequest;
import com.project.evrental.domain.dto.response.NearbyStationsPageResponse;
import com.project.evrental.service.search.LocationSearchService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationSearchController {

    LocationSearchService locationSearchService;

    @GetMapping("/stations/nearby")
    public ResponseEntity<ApiResponse<NearbyStationsPageResponse>> findNearbyStations(
            @Valid @RequestBody NearbyStationSearchRequest request
            ) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<NearbyStationsPageResponse>builder()
                        .statusCode(200)
                        .data(locationSearchService.findNearbyStations(request))
                        .build());
    }

}
