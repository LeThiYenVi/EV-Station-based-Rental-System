package com.project.evrental.service.search;

import com.project.evrental.domain.dto.request.NearbyStationSearchRequest;
import com.project.evrental.domain.dto.response.*;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.mapper.VehicleMapper;
import com.project.evrental.repository.StationRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.location.LocationClient;
import software.amazon.awssdk.services.location.model.CalculateRouteMatrixRequest;
import software.amazon.awssdk.services.location.model.CalculateRouteMatrixResponse;
import software.amazon.awssdk.services.location.model.RouteMatrixEntry;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationSearchService {

    StationRepository stationRepository;
    VehicleRepository vehicleRepository;
    LocationClient locationClient;

    private static final String CALCULATOR_NAME = "voltgo-routes-calculator";

    private static final double FALLBACK_DRIVING_FACTOR = 1.35;

    public NearbyStationsPageResponse findNearbyStations(NearbyStationSearchRequest request) {
        log.info("Searching for stations near lat: {}, lon: {}, radius: {}km",
                request.getLatitude(), request.getLongitude(), request.getRadiusKm());
        List<StationRepository.StationWithDistance> rawStations = determineFilterFieldInSearching(request);

        if (rawStations.isEmpty()) {
            return buildEmptyResponse(request);
        }

        List<NearbyStationResponse> stations = calculateAccurateDistances(rawStations, request);
        return NearbyStationsPageResponse.builder()
                .stations(stations)
                .userLocation(UserLocation.builder()
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .build())
                .metadata(SearchMetadata.builder()
                        .totalResults(stations.size())
                        .radiusKm(request.getRadiusKm())
                        .returnedCount(stations.size())
                        .searchTime(LocalDateTime.now())
                        .build())
                .build();
    }

    private List<NearbyStationResponse> calculateAccurateDistances(
            List<StationRepository.StationWithDistance> rawStations,
            NearbyStationSearchRequest request) {

        try {
            // Vị trí hiện tại cúa user
            List<Double> departurePosition = List.of(
                    request.getLongitude().doubleValue(),
                    request.getLatitude().doubleValue()
            );

            // Chuẩn bị danh sách đích (Stations)
            List<List<Double>> destinationPositions = rawStations.stream()
                    .map(s -> List.of(s.getLongitude().doubleValue(), s.getLatitude().doubleValue()))
                    .toList();

            // Tạo Request Batch (Gọi 1 lần cho N trạm -> Tiết kiệm & Nhanh)
            CalculateRouteMatrixRequest matrixRequest = CalculateRouteMatrixRequest.builder()
                    .calculatorName(CALCULATOR_NAME)
                    .departurePositions(List.of(departurePosition)) // Mảng chứa 1 điểm đi
                    .destinationPositions(destinationPositions)     // Mảng chứa N điểm đến
                    .travelMode("Car")                              // Tính đường ô tô
                    .distanceUnit("Kilometers")
                    .build();

            // Thực thi gọi AWS
            CalculateRouteMatrixResponse matrixResponse = locationClient.calculateRouteMatrix(matrixRequest);

            // Lấy hàng kết quả đầu tiên (vì chỉ có 1 điểm đi)
            List<RouteMatrixEntry> routeResults = matrixResponse.routeMatrix().get(0);

            List<NearbyStationResponse> finalStations = new ArrayList<>();

            // Duyệt danh sách gốc để ghép dữ liệu từ AWS vào
            for (int i = 0; i < rawStations.size(); i++) {
                StationRepository.StationWithDistance rawStation = rawStations.get(i);
                RouteMatrixEntry routeInfo = routeResults.get(i);

                Double finalDistance;
                Double travelTimeSeconds = null;

                if (routeInfo.error() != null) {
                    log.info("AWS Route Error for station {}: {}", rawStation.getName(), routeInfo.error().message());
                    finalDistance = rawStation.getDistanceKm() * FALLBACK_DRIVING_FACTOR;
                } else {
                    finalDistance = routeInfo.distance();
                    travelTimeSeconds = routeInfo.durationSeconds();
                }

                finalStations.add(mapToNearbyStationResponse(rawStation, request, finalDistance, travelTimeSeconds));
            }

            return finalStations;

        } catch (Exception e) {
            log.error("Failed to calculate routes with AWS Location Service", e);
            return rawStations.stream()
                    .map(s -> mapToNearbyStationResponse(s, request, s.getDistanceKm() * FALLBACK_DRIVING_FACTOR, null))
                    .toList();
        }
    }

    private NearbyStationResponse mapToNearbyStationResponse(
            StationRepository.StationWithDistance station,
            NearbyStationSearchRequest request,
            Double realDistanceKm,
            Double travelTimeSeconds) {

        UUID id = station.getId();
        String name = station.getName();
        String address = station.getAddress();
        String hotline = station.getHotline();
        BigDecimal latitude = station.getLatitude();
        BigDecimal longitude = station.getLongitude();
        Double rating = station.getRating();
        String status = station.getStatus();
        String photo = station.getPhoto();
        LocalDateTime startTime = station.getStartTime();
        LocalDateTime endTime = station.getEndTime();

        Double roundedDistance = null;
        if (realDistanceKm != null) {
            roundedDistance = BigDecimal.valueOf(realDistanceKm)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
        }
        List<Vehicle> availableVehicles;
        if(request.getStartTime() != null && request.getEndTime() != null) {
            availableVehicles = vehicleRepository.findTrulyAvailableVehicles(
                    id,
                    request.getFuelType(),
                    request.getStartTime(),
                    request.getEndTime()
            );
        } else {
            availableVehicles = vehicleRepository.findAvailableVehiclesByStationAndFuelTypeAndBrand(
                    id,
                    request.getFuelType(),
                    request.getBrand()
            );
        }

        List<AvailableVehicleSummary> availableVehicleSummaries = availableVehicles.stream()
                .map(VehicleMapper::mapToSummary)
                .toList();


        return NearbyStationResponse.builder()
                .id(id).name(name).address(address)
                .rating(rating).hotline(hotline)
                .latitude(latitude).longitude(longitude)
                .status(status).photo(photo)
                .distanceKm(roundedDistance)
                // .etaSeconds(travelTimeSeconds)
                .startTime(startTime).endTime(endTime)
                .availableVehicles(availableVehicleSummaries)
                .availableVehiclesCount(availableVehicleSummaries.size())
                .build();
    }

    private List<StationRepository.StationWithDistance> determineFilterFieldInSearching(
            NearbyStationSearchRequest request) {
        Double radiusMeters = request.getRadiusKm() * 1000.0;

        if(request.getMinRating() != null) {
            return stationRepository.findNearbyStationsWithRating(
                    request.getLatitude(),
                    request.getLongitude(),
                    radiusMeters,
                    request.getMinRating(),
                    request.getLimit()
            );
        } else {
            return stationRepository.findNearbyStations(
                    request.getLatitude(),
                    request.getLongitude(),
                    radiusMeters,
                    request.getLimit());
        }
    }

    private NearbyStationsPageResponse buildEmptyResponse(NearbyStationSearchRequest request) {
        return NearbyStationsPageResponse.builder()
                .stations(List.of())
                .userLocation(UserLocation.builder()
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .build())
                .metadata(SearchMetadata.builder()
                        .totalResults(0)
                        .radiusKm(request.getRadiusKm())
                        .returnedCount(0)
                        .searchTime(LocalDateTime.now())
                        .build())
                .build();
    }
}