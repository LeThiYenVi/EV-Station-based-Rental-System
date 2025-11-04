package com.project.evrental.domain.dto.analytic;

import com.project.evrental.domain.common.VehicleStatus;
import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUtilizationResponse {
    private UUID stationId;
    private String stationName;
    private Integer totalVehicles;
    private Integer availableVehicles;
    private Integer rentedVehicles;
    private Integer maintenanceVehicles;
    private Integer chargingVehicles;
    private Integer unavailableVehicles;
    private Double utilizationRate;
    private Map<VehicleStatus, Integer> statusBreakdown;
}