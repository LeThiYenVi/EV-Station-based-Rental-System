package com.project.evrental.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CognitoTokenResponse {

    @JsonProperty("access_token")
    String accessToken;

    @JsonProperty("refresh_token")
    String refreshToken;

    @JsonProperty("id_token")
    String idToken;

    @JsonProperty("token_type")
    String tokenType;

    @JsonProperty("expires_in")
    Integer expiresIn;

}