package com.project.evrental.repository;

import com.project.evrental.domain.common.BookingStatus;
import com.project.evrental.domain.common.BookingType;
import com.project.evrental.domain.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByIdAndRenterId(UUID id, UUID renterId);

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByRenterIdOrderByCreatedAtDesc(UUID renterId);

    List<Booking> findByStationIdAndStatusIn(UUID stationId, List<BookingStatus> statuses);

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.vehicle.id = :vehicleId
              AND b.status IN :statuses
              AND (b.startTime < :endTime AND b.expectedEndTime > :startTime)
            """)
    List<Booking> findConflictingBookings(
            @Param("vehicleId") UUID vehicleId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.renter.id = :renterId AND b.status = 'COMPLETED'")
    Long countCompletedBookingsByRenter(@Param("renterId") UUID renterId);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.renter.id = :renterId AND b.status = 'COMPLETED'")
    BigDecimal sumTotalAmountByRenter(@Param("renterId") UUID renterId);

    @Query(value = """
            SELECT EXTRACT(HOUR FROM b.start_time) AS hour, COUNT(*) AS count
            FROM booking b
            WHERE b.renter_id = :renterId
            GROUP BY EXTRACT(HOUR FROM b.start_time)
            ORDER BY count DESC
            """, nativeQuery = true)
    List<Object[]> findPeakHoursByRenter(@Param("renterId") UUID renterId);

    @Query(value = """
            SELECT EXTRACT(HOUR FROM b.start_time) AS hour, COUNT(*) AS count
            FROM booking b
            WHERE b.station_id = :stationId
            GROUP BY EXTRACT(HOUR FROM b.start_time)
            ORDER BY count DESC
            """, nativeQuery = true)
    List<Object[]> findPeakHoursByStation(@Param("stationId") UUID stationId);

    @Query(value = """
            SELECT TO_CHAR(b.start_time, 'YYYY-MM') AS month,
                   COUNT(*) AS count,
                   COALESCE(SUM(b.total_amount), 0) AS total
            FROM booking b
            WHERE b.renter_id = :renterId
              AND b.status = 'COMPLETED'
            GROUP BY TO_CHAR(b.start_time, 'YYYY-MM')
            ORDER BY month DESC
            """, nativeQuery = true)
    List<Object[]> findMonthlyStatisticsByRenter(@Param("renterId") UUID renterId);

    @Query(value = """
            SELECT TO_CHAR(b.start_time, 'YYYY-MM') AS month,
                   COUNT(*) AS count,
                   COALESCE(SUM(b.total_amount), 0) AS total
            FROM booking b
            WHERE b.station_id = :stationId
              AND b.status = 'COMPLETED'
            GROUP BY TO_CHAR(b.start_time, 'YYYY-MM')
            ORDER BY month DESC
            """, nativeQuery = true)
    List<Object[]> findMonthlyStatisticsByStation(@Param("stationId") UUID stationId);

    @Query(value = """
            SELECT TO_CHAR(b.start_time, 'YYYY-MM') AS month,
                   COUNT(*) AS count,
                   COALESCE(SUM(b.total_amount), 0) AS total
            FROM booking b
            WHERE b.station_id = :stationId
              AND b.status = 'COMPLETED'
              AND b.booking_type = :bookingType
            GROUP BY TO_CHAR(b.start_time, 'YYYY-MM')
            ORDER BY month DESC
            """, nativeQuery = true)
    List<Object[]> findMonthlyStatisticsByStationAndBookingType(
            @Param("stationId") UUID stationId,
            @Param("bookingType") BookingType bookingType
    );
}
