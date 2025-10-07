package com.project.evrental.domain.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetUserPasswordRequest {

    String email;

    String newPassword;

    String code;

}
