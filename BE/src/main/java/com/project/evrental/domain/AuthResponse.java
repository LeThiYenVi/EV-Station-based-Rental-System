package com.project.evrental.domain;

import com.project.evrental.domain.dto.response.UserResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthResponse {

    String accessToken;

    String refreshToken;

    String idToken;

    String tokenType;

    Integer expiresIn;

    UserResponse user;
}
