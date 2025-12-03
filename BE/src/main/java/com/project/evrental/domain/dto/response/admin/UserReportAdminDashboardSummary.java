package com.project.evrental.domain.dto.response.admin;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserReportAdminDashboardSummary {
    long countAllUser;
    long countAdmin;
    long countStaff;
    long countCustomer;
    double radiationWithMonthAgo; // percentage
}
