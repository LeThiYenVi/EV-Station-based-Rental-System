package com.project.evrental.service;

import com.project.evrental.domain.common.StationStatus;
import com.project.evrental.domain.dto.request.CreateStationRequest;
import com.project.evrental.domain.dto.request.UpdateStationRequest;
import com.project.evrental.domain.dto.response.StationDetailResponse;
import com.project.evrental.domain.dto.response.StationResponse;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.domain.entity.Station;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.StationMapper;
import com.project.evrental.mapper.VehicleMapper;
import com.project.evrental.repository.StationRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StationService {

    StationRepository stationRepository;
    VehicleRepository vehicleRepository;
    StationMapper stationMapper;
    VehicleMapper vehicleMapper;
    S3Service s3Service;
    GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Transactional
    public StationResponse createStation(CreateStationRequest request) {
        log.info("Creating station with name: {}", request.getName());

        Point location = geometryFactory.createPoint(
                new Coordinate(
                        request.getLongitude().doubleValue(), // X = lon
                        request.getLatitude().doubleValue()   // Y = lat
                )
        );
        location.setSRID(4326); // Ensure SRID for location calculation

        Station station = Station.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .hotline(request.getHotline())
                .photo(request.getPhoto())
                .location(location)
                .status(StationStatus.ACTIVE)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .rating(0.0)
                .build();

        Station savedStation = stationRepository.save(station);
        log.info("Station created with ID: {}", savedStation.getId());
        return stationMapper.toResponse(savedStation);
    }

    @Transactional
    public StationResponse updateStation(UUID stationId, UpdateStationRequest request) {
        log.info("Updating station with ID: {}", stationId);

        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + stationId));

        if (request.getName() != null) {
            station.setName(request.getName());
        }
        if (request.getAddress() != null) {
            station.setAddress(request.getAddress());
        }
        if (request.getLatitude() != null && request.getLongitude() != null) {
            station.setLatitude(request.getLatitude());
            station.setLongitude(request.getLongitude());
            Point location = geometryFactory.createPoint(
                    new Coordinate(request.getLongitude().doubleValue(), request.getLatitude().doubleValue())
            );
            station.setLocation(location);
        }
        if (request.getHotline() != null) {
            station.setHotline(request.getHotline());
        }
        if (request.getPhoto() != null) {
            station.setPhoto(request.getPhoto());
        }
        if (request.getStatus() != null) {
            station.setStatus(request.getStatus());
        }
        if (request.getStartTime() != null) {
            station.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            station.setEndTime(request.getEndTime());
        }
        if (request.getRating() != null) {
            station.setRating(request.getRating());
        }

        Station updatedStation = stationRepository.save(station);
        log.info("Station updated successfully with ID: {}", stationId);
        return stationMapper.toResponse(updatedStation);
    }

    @Transactional(readOnly = true)
    public StationDetailResponse getStationDetailById(UUID stationId) {
        log.info("Fetching station detail with ID: {}", stationId);
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + stationId));

        List<Vehicle> vehicles = vehicleRepository.findAvailableVehiclesByStationAndFuelTypeAndBrand(
                stationId, null, null
        );

        Integer totalVehicles = vehicles.size();
        Integer availableVehicles = stationRepository.countAvailableVehicles(stationId);
        List<VehicleResponse> vehicleResponses = vehicles.stream()
                .map(x -> VehicleMapper.toResponse(x))
                .collect(Collectors.toList());

        StationDetailResponse response = stationMapper.toDetailResponse(station, totalVehicles, availableVehicles);
        response.setVehicles(vehicleResponses);

        return response;
    }

    @Transactional(readOnly = true)
    public Page<StationResponse> getAllStations(Pageable pageable) {
        log.info("Fetching all stations with pagination");
        Page<Station> stations = stationRepository.findAll(pageable);
        return stations.map(stationMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<StationResponse> getActiveStations() {
        log.info("Fetching all active stations");
        List<Station> stations = stationRepository.findAll();
        return stations.stream()
                .filter(station -> station.getStatus() == StationStatus.ACTIVE)
                .map(stationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteStation(UUID stationId) {
        log.info("Deleting station with ID: {}", stationId);
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + stationId));

        if (station.getPhoto() != null) {
            s3Service.deleteFile(station.getPhoto());
        }

        stationRepository.delete(station);
        log.info("Station deleted successfully with ID: {}", stationId);
    }

    @Transactional
    public StationResponse changeStationStatus(UUID stationId, StationStatus status) {
        log.info("Changing station status to {} for ID: {}", status, stationId);
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + stationId));

        station.setStatus(status);
        Station updatedStation = stationRepository.save(station);
        log.info("Station status changed successfully for ID: {}", stationId);
        return stationMapper.toResponse(updatedStation);
    }

    @Transactional(readOnly = true)
    public List<StationResponse> getStationsByStatus(StationStatus status) {
        log.info("Fetching stations with status: {}", status);
        List<Station> stations = stationRepository.findAll();
        return stations.stream()
                .filter(station -> station.getStatus() == status)
                .map(stationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Integer getAvailableVehiclesCount(UUID stationId) {
        log.info("Counting available vehicles for station ID: {}", stationId);
        if (!stationRepository.existsById(stationId)) {
            throw new ResourceNotFoundException("Station not found with ID: " + stationId);
        }
        return stationRepository.countAvailableVehicles(stationId);
    }

    @Transactional
    public StationResponse uploadStationPhoto(UUID stationId, org.springframework.web.multipart.MultipartFile file) {
        log.info("Uploading photo for station: {}", stationId);
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + stationId));

        if (station.getPhoto() != null) {
            s3Service.deleteFile(station.getPhoto());
        }

        String photoUrl = s3Service.uploadFile(file, "assets/stations");
        station.setPhoto(photoUrl);

        Station updatedStation = stationRepository.save(station);
        log.info("Station photo uploaded successfully for ID: {}", stationId);
        return stationMapper.toResponse(updatedStation);
    }

    @Transactional(readOnly = true)
    public List<StationResponse> getFeaturedStations(int limit) {
        log.info("Fetching {} featured stations", limit);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        List<Station> stations = stationRepository.findFeaturedStations(pageable);
        return stations.stream()
                .map(stationMapper::toResponse)
                .collect(Collectors.toList());
    }
}
