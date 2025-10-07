package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NearbyStationsPageResponse {

    List<NearbyStationResponse> stations;

    UserLocation userLocation;

    SearchMetadata metadata;

}
