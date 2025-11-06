package com.project.evrental.repository;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByRenterId(UUID renterId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByVehicleId(UUID vehicleId);

    List<Booking> findByStationId(UUID stationId);
}
