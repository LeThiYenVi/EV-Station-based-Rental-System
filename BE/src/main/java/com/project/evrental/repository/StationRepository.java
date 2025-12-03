package com.project.evrental.repository;

import com.project.evrental.domain.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StationRepository extends JpaRepository<Station, UUID> {

    interface StationWithDistance {
        UUID getId();
        String getName();
        String getAddress();
        Double getRating();
        BigDecimal getLatitude();
        BigDecimal getLongitude();
        String getHotline();
        String getStatus();
        String getPhoto();
        LocalDateTime getStartTime();
        LocalDateTime getEndTime();
        LocalDateTime getCreatedAt();
        LocalDateTime getUpdatedAt();
        Double getDistanceKm();
    }

    @Query(value = """
            SELECT
                s.id as id,
                s.name as name,
                s.address as address,
                s.rating as rating,
                s.latitude as latitude,
                s.longitude as longitude,
                s.hotline as hotline,
                s.status as status,
                s.photo as photo,
                s.start_time as startTime,
                s.end_time as endTime,
                s.created_at as createdAt,
                s.updated_at as updatedAt,
                ST_DISTANCE(
                    s.location,
                    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
                )/1000.0 as distanceKm
            FROM stations s
            WHERE s.status = 'ACTIVE'
            AND ST_DWithin(
                s.location,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                :radiusMeters
            )
            ORDER BY distanceKm ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<StationWithDistance> findNearbyStations(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radiusMeters") Double radiusMeters,
            @Param("limit") Integer limit
    );

    @Query(value = """
            SELECT
                s.id as id,
                s.name as name,
                s.address as address,
                s.rating as rating,
                s.latitude as latitude,
                s.longitude as longitude,
                s.hotline as hotline,
                s.status as status,
                s.photo as photo,
                s.start_time as startTime,
                s.end_time as endTime,
                s.created_at as createdAt,
                s.updated_at as updatedAt,
                ST_Distance(
                    s.location,
                    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
                )/1000.0 as distanceKm
            FROM stations s
            WHERE s.status = 'ACTIVE'
            AND s.rating >= :minRating
            AND ST_DWithin(
                s.location,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
                :radiusMeters
            )
            ORDER BY distanceKm ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<StationWithDistance> findNearbyStationsWithRating(
            @Param("latitude") BigDecimal latitude,
            @Param("longitude") BigDecimal longitude,
            @Param("radiusMeters") Double radiusMeters,
            @Param("minRating") Double minRating,
            @Param("limit") Integer limit
    );

    @Query(value = """
            SELECT COUNT(v.id)
            FROM vehicles v
            WHERE v.station_id = :stationId
            AND v.status = 'AVAILABLE'
            """, nativeQuery = true)
    Integer countAvailableVehicles(@Param("stationId") UUID stationId);

    @Query("""
            SELECT s FROM Station s
            WHERE s.status = 'ACTIVE'
            ORDER BY s.rating DESC, s.createdAt DESC
            """)
    List<Station> findFeaturedStations(org.springframework.data.domain.Pageable pageable);
}
