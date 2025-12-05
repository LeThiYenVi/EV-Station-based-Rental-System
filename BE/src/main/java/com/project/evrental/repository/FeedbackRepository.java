package com.project.evrental.repository;

import com.project.evrental.domain.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
    
    // Basic queries
    Optional<Feedback> findByBookingId(UUID bookingId);
    
    boolean existsByBookingId(UUID bookingId);

    Page<Feedback> findByRenterIdOrderByCreatedAtDesc(UUID renterId, Pageable pageable);

    // Vehicle statistics
    @Query("SELECT AVG(f.vehicleRating) FROM Feedback f WHERE f.booking.vehicle.id = :vehicleId")
    Double findAverageVehicleRating(@Param("vehicleId") UUID vehicleId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.booking.vehicle.id = :vehicleId")
    Long countByVehicleId(@Param("vehicleId") UUID vehicleId);
    
    @Query("SELECT f FROM Feedback f WHERE f.booking.vehicle.id = :vehicleId ORDER BY f.createdAt DESC")
    Page<Feedback> findByVehicleId(@Param("vehicleId") UUID vehicleId, Pageable pageable);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.booking.vehicle.id = :vehicleId " +
           "AND f.vehicleRating >= :minRating AND f.vehicleRating < :maxRating")
    Long countByVehicleIdAndRatingRange(@Param("vehicleId") UUID vehicleId, 
                                         @Param("minRating") Double minRating,
                                         @Param("maxRating") Double maxRating);

    // Station statistics
    @Query("SELECT AVG(f.stationRating) FROM Feedback f WHERE f.booking.station.id = :stationId")
    Double findAverageStationRating(@Param("stationId") UUID stationId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.booking.station.id = :stationId")
    Long countByStationId(@Param("stationId") UUID stationId);
    
    @Query("SELECT f FROM Feedback f WHERE f.booking.station.id = :stationId ORDER BY f.createdAt DESC")
    Page<Feedback> findByStationId(@Param("stationId") UUID stationId, Pageable pageable);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.booking.station.id = :stationId " +
           "AND f.stationRating >= :minRating AND f.stationRating < :maxRating")
    Long countByStationIdAndRatingRange(@Param("stationId") UUID stationId,
                                         @Param("minRating") Double minRating,
                                         @Param("maxRating") Double maxRating);

    // Admin/Staff moderation queries with filters
    @Query("SELECT f FROM Feedback f WHERE " +
           "(:stationId IS NULL OR f.booking.station.id = :stationId) AND " +
           "(:vehicleId IS NULL OR f.booking.vehicle.id = :vehicleId) AND " +
           "(:renterId IS NULL OR f.renter.id = :renterId) AND " +
           "(:responded IS NULL OR (f.response IS NOT NULL) = :responded) AND " +
           "(:fromDate IS NULL OR f.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR f.createdAt <= :toDate) AND " +
           "(:minRating IS NULL OR (f.vehicleRating >= :minRating AND f.stationRating >= :minRating)) AND " +
           "(:maxRating IS NULL OR (f.vehicleRating <= :maxRating AND f.stationRating <= :maxRating)) " +
           "ORDER BY f.createdAt DESC")
    Page<Feedback> findByFilters(@Param("stationId") UUID stationId,
                                  @Param("vehicleId") UUID vehicleId,
                                  @Param("renterId") UUID renterId,
                                  @Param("responded") Boolean responded,
                                  @Param("fromDate") LocalDateTime fromDate,
                                  @Param("toDate") LocalDateTime toDate,
                                  @Param("minRating") Double minRating,
                                  @Param("maxRating") Double maxRating,
                                  Pageable pageable);

    // Global statistics
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.response IS NOT NULL")
    Long countRespondedFeedbacks();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.response IS NULL")
    Long countUnrespondedFeedbacks();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.createdAt >= :date")
    Long countFeedbacksSinceDate(@Param("date") LocalDateTime date);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, f.createdAt, f.respondedAt)) FROM Feedback f WHERE f.respondedAt IS NOT NULL")
    Double findAverageResponseTimeInHours();
    
    // Top rated vehicle
    @Query("SELECT f.booking.vehicle.id, f.booking.vehicle.name, AVG(f.vehicleRating) as avgRating " +
           "FROM Feedback f GROUP BY f.booking.vehicle.id, f.booking.vehicle.name " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedVehicles(Pageable pageable);
    
    // Top rated station
    @Query("SELECT f.booking.station.id, f.booking.station.name, AVG(f.stationRating) as avgRating " +
           "FROM Feedback f GROUP BY f.booking.station.id, f.booking.station.name " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedStations(Pageable pageable);
    
    // Global rating distribution
    @Query("SELECT CAST(FLOOR(f.vehicleRating) AS int), COUNT(f) FROM Feedback f " +
           "GROUP BY CAST(FLOOR(f.vehicleRating) AS int)")
    List<Object[]> getVehicleRatingDistribution();
    
    @Query("SELECT CAST(FLOOR(f.stationRating) AS int), COUNT(f) FROM Feedback f " +
           "GROUP BY CAST(FLOOR(f.stationRating) AS int)")
    List<Object[]> getStationRatingDistribution();
}

