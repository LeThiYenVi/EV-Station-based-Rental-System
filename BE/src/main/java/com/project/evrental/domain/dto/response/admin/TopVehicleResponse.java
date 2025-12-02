package com.project.evrental.domain.dto.response.admin;

import com.project.evrental.domain.dto.response.VehicleResponse;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TopVehicleResponse {
    VehicleResponse vehicle;
    int rentCount;
}
