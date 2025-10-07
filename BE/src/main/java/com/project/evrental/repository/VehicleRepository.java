package com.project.evrental.repository;

import com.project.evrental.domain.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    @Query("""
            SELECT v
            FROM Vehicle v
            WHERE v.status = 'AVAILABLE'
              AND v.station.id = :stationId
              AND (:fuelType IS NULL OR v.fuelType = :fuelType)
              AND (:brand IS NULL OR v.brand = :brand)
            ORDER BY v.rating DESC, v.rentCount DESC
    """)
    List<Vehicle> findAvailableVehiclesByStationAndFuelTypeAndBrand(
            @Param("stationId") UUID stationId,
            @Param("fuelType") String fuelType,
            @Param("brand") String brand
    );

    @Query(value = """
            SELECT v.*
            FROM vehicles v
            WHERE v.station_id = :stationId
            AND (:fuelType IS NULL OR v.fuelType = :fuelType)
            AND NOT EXISTS (
                SELECT 1
                FROM bookings b
                WHERE b.vehicle_id = v.id
                AND b.status NOT IN ('CANCELLED', 'COMPLETED')
                AND (
                    b.start_time <= :endTime AND b.expected_end_time >= :startTime
                )
            )
            ORDER BY v.rating DESC NULLS LAST, v.rent_count DESC
            """, nativeQuery = true)
    List<Vehicle> findTrulyAvailableVehicles(
            @Param("stationId") UUID stationId,
            @Param("fuelType") String fuelType,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
