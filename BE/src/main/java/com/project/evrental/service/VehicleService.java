package com.project.evrental.service;

import com.project.evrental.domain.common.VehicleStatus;
import com.project.evrental.domain.dto.request.CreateVehicleRequest;
import com.project.evrental.domain.dto.request.UpdateVehicleRequest;
import com.project.evrental.domain.dto.response.VehicleDetailResponse;
import com.project.evrental.domain.dto.response.VehicleResponse;
import com.project.evrental.domain.entity.Station;
import com.project.evrental.domain.entity.Vehicle;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.VehicleMapper;
import com.project.evrental.repository.StationRepository;
import com.project.evrental.repository.VehicleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleService {

    VehicleRepository vehicleRepository;
    StationRepository stationRepository;
    S3Service s3Service;

    @Transactional
    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        log.info("Creating vehicle with license plate: {}", request.getLicensePlate());

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + request.getStationId()));

        Vehicle vehicle = Vehicle.builder()
                .station(station)
                .licensePlate(request.getLicensePlate())
                .name(request.getName())
                .brand(request.getBrand())
                .color(request.getColor())
                .fuelType(request.getFuelType())
                .capacity(request.getCapacity())
                .photos(request.getPhotos())
                .status(VehicleStatus.AVAILABLE)
                .hourlyRate(request.getHourlyRate())
                .dailyRate(request.getDailyRate())
                .depositAmount(request.getDepositAmount())
                .rating(0.0)
                .rentCount(0)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle created with ID: {}", savedVehicle.getId());
        return VehicleMapper.toResponse(savedVehicle);
    }

    @Transactional
    public VehicleResponse updateVehicle(UUID vehicleId, UpdateVehicleRequest request) {
        log.info("Updating vehicle with ID: {}", vehicleId);

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (request.getStationId() != null) {
            Station station = stationRepository.findById(request.getStationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Station not found with ID: " + request.getStationId()));
            vehicle.setStation(station);
        }

        if (request.getLicensePlate() != null) {
            vehicle.setLicensePlate(request.getLicensePlate());
        }
        if (request.getName() != null) {
            vehicle.setName(request.getName());
        }
        if (request.getBrand() != null) {
            vehicle.setBrand(request.getBrand());
        }
        if (request.getColor() != null) {
            vehicle.setColor(request.getColor());
        }
        if (request.getFuelType() != null) {
            vehicle.setFuelType(request.getFuelType());
        }
        if (request.getCapacity() != null) {
            vehicle.setCapacity(request.getCapacity());
        }
        if (request.getPhotos() != null) {
            vehicle.setPhotos(request.getPhotos());
        }
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }
        if (request.getHourlyRate() != null) {
            vehicle.setHourlyRate(request.getHourlyRate());
        }
        if (request.getDailyRate() != null) {
            vehicle.setDailyRate(request.getDailyRate());
        }
        if (request.getDepositAmount() != null) {
            vehicle.setDepositAmount(request.getDepositAmount());
        }
        if (request.getRating() != null) {
            vehicle.setRating(request.getRating());
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle updated successfully with ID: {}", vehicleId);
        return VehicleMapper.toResponse(updatedVehicle);
    }

    @Transactional(readOnly = true)
    public VehicleDetailResponse getVehicleDetailById(UUID vehicleId) {
        log.info("Fetching vehicle detail with ID: {}", vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        Boolean isAvailable = vehicle.getStatus() == VehicleStatus.AVAILABLE;

        return VehicleDetailResponse.builder()
                .id(vehicle.getId())
                .stationId(vehicle.getStation().getId())
                .stationName(vehicle.getStation().getName())
                .licensePlate(vehicle.getLicensePlate())
                .name(vehicle.getName())
                .brand(vehicle.getBrand())
                .color(vehicle.getColor())
                .fuelType(vehicle.getFuelType() != null ? vehicle.getFuelType().toString() : null)
                .rating(vehicle.getRating() != null ? java.math.BigDecimal.valueOf(vehicle.getRating()) : null)
                .capacity(vehicle.getCapacity())
                .rentCount(vehicle.getRentCount())
                .photos(vehicle.getPhotos())
                .status(vehicle.getStatus() != null ? vehicle.getStatus().toString() : null)
                .hourlyRate(vehicle.getHourlyRate())
                .dailyRate(vehicle.getDailyRate())
                .depositAmount(vehicle.getDepositAmount())
                .isAvailable(isAvailable)
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {
        log.info("Fetching all vehicles with pagination");
        Page<Vehicle> vehicles = vehicleRepository.findAll(pageable);
        return vehicles.map(VehicleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByStationId(UUID stationId) {
        log.info("Fetching vehicles for station ID: {}", stationId);
        if (!stationRepository.existsById(stationId)) {
            throw new ResourceNotFoundException("Station not found with ID: " + stationId);
        }
        List<Vehicle> vehicles = vehicleRepository.findAvailableVehiclesByStationAndFuelTypeAndBrand(
                stationId, null, null
        );
        return vehicles.stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getAvailableVehicles(UUID stationId, String fuelType, String brand) {
        log.info("Fetching available vehicles - station: {}, fuelType: {}, brand: {}", stationId, fuelType, brand);
        List<Vehicle> vehicles = vehicleRepository.findAvailableVehiclesByStationAndFuelTypeAndBrand(
                stationId, fuelType, brand
        );
        return vehicles.stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getTrulyAvailableVehicles(
            UUID stationId,
            String fuelType,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        log.info("Fetching truly available vehicles for station: {} between {} and {}", stationId, startTime, endTime);
        List<Vehicle> vehicles = vehicleRepository.findTrulyAvailableVehicles(
                stationId, fuelType, startTime, endTime
        );
        return vehicles.stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByStatus(VehicleStatus status) {
        log.info("Fetching vehicles with status: {}", status);
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicles.stream()
                .filter(vehicle -> vehicle.getStatus() == status)
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByBrand(String brand) {
        log.info("Fetching vehicles with brand: {}", brand);
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicles.stream()
                .filter(vehicle -> vehicle.getBrand() != null && vehicle.getBrand().equalsIgnoreCase(brand))
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteVehicle(UUID vehicleId) {
        log.info("Deleting vehicle with ID: {}", vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (vehicle.getPhotos() != null && vehicle.getPhotos().length > 0) {
            for (String photoUrl : vehicle.getPhotos()) {
                s3Service.deleteFile(photoUrl);
            }
        }

        vehicleRepository.delete(vehicle);
        log.info("Vehicle deleted successfully with ID: {}", vehicleId);
    }

    @Transactional
    public VehicleResponse changeVehicleStatus(UUID vehicleId, VehicleStatus status) {
        log.info("Changing vehicle status to {} for ID: {}", status, vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        vehicle.setStatus(status);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle status changed successfully for ID: {}", vehicleId);
        return VehicleMapper.toResponse(updatedVehicle);
    }

    @Transactional
    public VehicleResponse incrementRentCount(UUID vehicleId) {
        log.info("Incrementing rent count for vehicle ID: {}", vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        vehicle.setRentCount(vehicle.getRentCount() + 1);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        log.info("Rent count incremented for vehicle ID: {}", vehicleId);
        return VehicleMapper.toResponse(updatedVehicle);
    }

    @Transactional
    public VehicleResponse uploadVehiclePhotos(UUID vehicleId, org.springframework.web.multipart.MultipartFile[] files) {
        log.info("Uploading photos for vehicle: {}", vehicleId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (vehicle.getPhotos() != null && vehicle.getPhotos().length > 0) {
            for (String photoUrl : vehicle.getPhotos()) {
                s3Service.deleteFile(photoUrl);
            }
        }

        String[] photoUrls = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            photoUrls[i] = s3Service.uploadFile(files[i], "assets/vehicles");
        }

        vehicle.setPhotos(photoUrls);
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        log.info("Vehicle photos uploaded successfully for ID: {}", vehicleId);
        return VehicleMapper.toResponse(updatedVehicle);
    }
}
