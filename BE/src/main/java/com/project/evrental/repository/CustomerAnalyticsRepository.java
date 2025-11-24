package com.project.evrental.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

/**
 * Customer risk & behavior metrics queries.
 */
@Repository
public interface CustomerAnalyticsRepository extends CrudRepository<com.project.evrental.domain.entity.Booking, UUID> {

    interface CustomerRiskProjection {
        UUID getRenterId();
        Long getTotalBookings();
        Long getCancellations();
        Long getLateReturns();
        Double getAvgFeedbackRating();
        Long getNegativeFeedbacks();
    }

    @Query(value = """
            SELECT b.renter_id AS renterId,
                   COUNT(*) AS totalBookings,
                   SUM(CASE WHEN b.status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancellations,
                   SUM(CASE WHEN b.actual_end_time IS NOT NULL AND b.actual_end_time > b.expected_end_time THEN 1 ELSE 0 END) AS lateReturns,
                   COALESCE(AVG( (f.station_rating + f.vehicle_rating) / 2.0 ), 0) AS avgFeedbackRating,
                   SUM(CASE WHEN (f.station_rating < 3 OR f.vehicle_rating < 3) THEN 1 ELSE 0 END) AS negativeFeedbacks
            FROM bookings b
            LEFT JOIN feedbacks f ON f.booking_id = b.id
            GROUP BY b.renter_id
            HAVING COUNT(*) >= :minBookings
            ORDER BY cancellations DESC, lateReturns DESC
            """, nativeQuery = true)
    List<CustomerRiskProjection> customerRiskMetrics(@Param("minBookings") int minBookings);

}
