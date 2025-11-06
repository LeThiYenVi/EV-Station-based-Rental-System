package com.project.evrental.repository;

import com.project.evrental.domain.common.StationStatus;
import com.project.evrental.domain.entity.Station;
import org.springframework.data.domain.Pageable;
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
            s.id              AS id,
            s.name            AS name,
            s.address         AS address,
            s.rating          AS rating,
            s.latitude        AS latitude,
            s.longitude       AS longitude,
            s.hotline         AS hotline,
            s.status          AS status,
            s.photo           AS photo,
            s.start_time      AS startTime,
            s.end_time        AS endTime,
            s.created_at      AS createdAt,
            s.updated_at      AS updatedAt,
            ST_Distance(
              s.location,
              ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
            ) / 1000.0        AS distanceKm
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
            s.id              AS id,
            s.name            AS name,
            s.address         AS address,
            s.rating          AS rating,
            s.latitude        AS latitude,
            s.longitude       AS longitude,
            s.hotline         AS hotline,
            s.status          AS status,
            s.photo           AS photo,
            s.start_time      AS startTime,
            s.end_time        AS endTime,
            s.created_at      AS createdAt,
            s.updated_at      AS updatedAt,
            ST_Distance(
              s.location,
              ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
            ) / 1000.0        AS distanceKm
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
    Long countAvailableVehicles(@Param("stationId") UUID stationId);

    @Query(value = """
        SELECT s.*
        FROM stations s
        WHERE s.status = 'ACTIVE'
        ORDER BY ST_Distance(
                 s.location,
                 ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
               ) ASC
        """, nativeQuery = true)
    List<Station> findNearestStationsNative(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            Pageable pageable
    );

    List<Station> findByStatus(StationStatus status);
}
