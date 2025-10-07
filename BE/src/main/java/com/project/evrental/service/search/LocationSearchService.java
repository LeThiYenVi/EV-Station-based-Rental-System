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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LocationSearchService {

    StationRepository stationRepository;

    VehicleRepository vehicleRepository;

    public NearbyStationsPageResponse findNearbyStations(NearbyStationSearchRequest request) {
        log.info("Searching for stations near lat: {}, lon: {}, radius: {}km",
                request.getLatitude(), request.getLongitude(), request.getRadiusKm());

        List<StationRepository.StationWithDistance> results = determineFilterFieldInSearching(request);
        List<NearbyStationResponse> stations = results.stream()
                .map(x -> mapToNearbyStationResponse(x, request))
                .toList();

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

    private NearbyStationResponse mapToNearbyStationResponse(StationRepository.StationWithDistance station,
                                                             NearbyStationSearchRequest request) {
        UUID id = station.getId();
        String name = station.getName();
        String address = station.getAddress();
        String hotline = station.getHotline();
        BigDecimal latitude = station.getLatitude();
        BigDecimal longitude = station.getLongitude();
        Double rating = station.getRating();
        String status = station.getStatus();
        String photo = station.getPhoto();
        Double distanceKm = station.getDistanceKm();
        LocalDateTime startTime = station.getStartTime();
        LocalDateTime endTime = station.getEndTime();

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
                .status(status).photo(photo).distanceKm(distanceKm)
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



}
