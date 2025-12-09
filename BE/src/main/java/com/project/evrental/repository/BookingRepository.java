package com.project.evrental.repository;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    // Count bookings by renter
    long countByRenterId(UUID renterId);

    // Count bookings by renter and status
    long countByRenterIdAndStatus(UUID renterId, BookingStatus status);

    // Count bookings by status
    long countByStatus(BookingStatus status);

    // Count bookings created today
    @Query("SELECT COUNT(b) FROM Booking b WHERE FUNCTION('DATE', b.createdAt) = CURRENT_DATE")
    long countBookingsToday();

    // Count bookings created in a specific month/year
    @Query("SELECT COUNT(b) FROM Booking b WHERE FUNCTION('YEAR', b.createdAt) = :year AND FUNCTION('MONTH', b.createdAt) = :month")
    long countBookingsByYearAndMonth(@Param("year") int year, @Param("month") int month);

    // Find bookings created after a specific date
    List<Booking> findByCreatedAtAfter(LocalDateTime date);

    // Count bookings by multiple statuses
    long countByStatusIn(List<BookingStatus> statuses);
    @Query("SELECT b FROM Booking b WHERE b.id=:id AND b.status = 'COMPLETED'")
    Booking findBookingByIdAndStatusCompleted(UUID bookingId);
}
