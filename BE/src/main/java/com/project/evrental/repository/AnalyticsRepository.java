package com.project.evrental.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsRepository extends CrudRepository<com.project.evrental.domain.entity.Booking, UUID> {

    interface RevenueByStationProjection {
        UUID getStationId();
        BigDecimal getRevenue();
        Long getBookingCount();
    }

    @Query(value = """
            SELECT b.station_id AS stationId,
                   COALESCE(SUM(p.amount), 0) AS revenue,
                   COUNT(DISTINCT b.id) AS bookingCount
            FROM bookings b
            LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'SUCCESS'
            WHERE b.created_at BETWEEN :startTime AND :endTime
            AND (:stationId IS NULL OR b.station_id = :stationId)
            GROUP BY b.station_id
            ORDER BY revenue DESC
            """, nativeQuery = true)
    List<RevenueByStationProjection> revenueByStation(@Param("startTime") LocalDateTime startTime,
                                                      @Param("endTime") LocalDateTime endTime,
                                                      @Param("stationId") UUID stationId);

    interface UtilizationProjection {
        UUID getStationId();
        Double getUtilization();
        Long getVehicleCount();
        Long getActiveBookingSeconds();
    }

    @Query(value = """
            WITH booking_window AS (
                SELECT b.station_id,
                       EXTRACT(EPOCH FROM (LEAST(COALESCE(b.actual_end_time, b.expected_end_time), :endTime)
                            - GREATEST(b.start_time, :startTime))) AS occupied_seconds
                FROM bookings b
                WHERE b.status IN ('CONFIRMED','ONGOING','COMPLETED')
                  AND b.start_time < :endTime
                  AND COALESCE(b.actual_end_time, b.expected_end_time) > :startTime
                  AND (:stationId IS NULL OR b.station_id = :stationId)
            ), agg AS (
                SELECT station_id, SUM(occupied_seconds) AS active_seconds
                FROM booking_window
                GROUP BY station_id
            ), veh AS (
                SELECT station_id, COUNT(*) AS vehicle_count
                FROM vehicles
                GROUP BY station_id
            )
            SELECT a.station_id AS stationId,
                   (a.active_seconds / (v.vehicle_count * EXTRACT(EPOCH FROM (:endTime - :startTime)))) AS utilization,
                   v.vehicle_count AS vehicleCount,
                   a.active_seconds AS activeBookingSeconds
            FROM agg a
            JOIN veh v ON v.station_id = a.station_id
            ORDER BY utilization DESC
            """, nativeQuery = true)
    List<UtilizationProjection> utilizationByStation(@Param("startTime") LocalDateTime startTime,
                                                     @Param("endTime") LocalDateTime endTime,
                                                     @Param("stationId") UUID stationId);

    interface PeakHourProjection {
        Integer getHour();
        Long getBookingCount();
    }

    @Query(value = """
            SELECT DATE_PART('hour', b.start_time) AS hour,
                   COUNT(*) AS bookingCount
            FROM bookings b
            WHERE b.start_time BETWEEN :startTime AND :endTime
              AND b.status IN ('CONFIRMED','ONGOING','COMPLETED')
              AND (:stationId IS NULL OR b.station_id = :stationId)
            GROUP BY hour
            ORDER BY bookingCount DESC
            """, nativeQuery = true)
    List<PeakHourProjection> peakHours(@Param("startTime") LocalDateTime startTime,
                                       @Param("endTime") LocalDateTime endTime,
                                       @Param("stationId") UUID stationId);

    interface StaffPerformanceProjection {
        UUID getStaffId();
        String getFullName();
        Long getHandoversOut();
        Long getHandoversIn();
        Double getAvgStationRating();
        Double getAvgVehicleRating();
    }

    @Query(value = """
            SELECT u.id AS staffId,
                   u.full_name AS fullName,
                   COALESCE(COUNT(DISTINCT CASE WHEN b.checked_out_by = u.id THEN b.id END),0) AS handoversOut,
                   COALESCE(COUNT(DISTINCT CASE WHEN b.checked_in_by = u.id THEN b.id END),0) AS handoversIn,
                   COALESCE(AVG(f.station_rating),0) AS avgStationRating,
                   COALESCE(AVG(f.vehicle_rating),0) AS avgVehicleRating
            FROM users u
            LEFT JOIN bookings b ON (b.checked_out_by = u.id OR b.checked_in_by = u.id)
                                  AND b.created_at BETWEEN :startTime AND :endTime
            LEFT JOIN feedbacks f ON f.booking_id = b.id
            WHERE u.role = 'STAFF'
              AND (:stationId IS NULL OR u.station_id = :stationId)
            GROUP BY u.id, u.full_name
            ORDER BY handoversOut + handoversIn DESC
            """, nativeQuery = true)
    List<StaffPerformanceProjection> staffPerformance(@Param("startTime") LocalDateTime startTime,
                                                      @Param("endTime") LocalDateTime endTime,
                                                      @Param("stationId") UUID stationId);

}
