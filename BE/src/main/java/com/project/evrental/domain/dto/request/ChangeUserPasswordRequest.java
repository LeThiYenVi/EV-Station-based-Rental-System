package com.project.evrental.domain.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeUserPasswordRequest {

    String accessToken;

    String currentPassword;

    String newPassword;
}
