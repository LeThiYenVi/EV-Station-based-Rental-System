package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRoleRequest {

    @NotNull(message = "Role is required")
    UserRole role;
}
