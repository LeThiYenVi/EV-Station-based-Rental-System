package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.StationDetailResponse;
import com.project.evrental.domain.dto.response.StationResponse;
import com.project.evrental.domain.entity.Station;
import org.springframework.stereotype.Component;

@Component
public class StationMapper {

    public StationResponse toResponse(Station station) {
        if (station == null) {
            return null;
        }

        return StationResponse.builder()
                .id(station.getId())
                .name(station.getName())
                .address(station.getAddress())
                .rating(station.getRating())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .hotline(station.getHotline())
                .status(station.getStatus())
                .photo(station.getPhoto())
                .startTime(station.getStartTime())
                .endTime(station.getEndTime())
                .createdAt(station.getCreatedAt())
                .updatedAt(station.getUpdatedAt())
                .build();
    }

    public StationDetailResponse toDetailResponse(Station station, Integer totalVehicles, Integer availableVehicles) {
        if (station == null) {
            return null;
        }

        return StationDetailResponse.builder()
                .id(station.getId())
                .name(station.getName())
                .address(station.getAddress())
                .rating(station.getRating())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .hotline(station.getHotline())
                .status(station.getStatus())
                .photo(station.getPhoto())
                .startTime(station.getStartTime())
                .endTime(station.getEndTime())
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .createdAt(station.getCreatedAt())
                .updatedAt(station.getUpdatedAt())
                .build();
    }
}
