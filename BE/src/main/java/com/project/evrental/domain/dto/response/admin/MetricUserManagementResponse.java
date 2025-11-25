package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MetricUserManagementResponse {
    long totalUser;
    long totalVerifiedUser;
    long totalBlockedUser;
}
