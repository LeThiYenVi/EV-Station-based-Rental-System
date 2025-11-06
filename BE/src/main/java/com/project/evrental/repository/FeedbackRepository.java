package com.project.evrental.repository;

import com.project.evrental.domain.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    Optional<Feedback> findByBookingId(UUID bookingId);

    List<Feedback> findByRenterIdOrderByCreatedAtDesc(UUID renterId);

    @Query("SELECT AVG(f.vehicleRating) FROM Feedback f WHERE f.booking.vehicle.id = :vehicleId")
    Double findAverageVehicleRating(@Param("vehicleId") UUID vehicleId);

    @Query("SELECT AVG(f.stationRating) FROM Feedback f WHERE f.booking.station.id = :stationId")
    Double findAverageStationRating(@Param("stationId") UUID stationId);
}

