package com.project.evrental.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class OauthState {

    String state;

    LocalDateTime createdAt;

    LocalDateTime expiresAt;

    @JsonIgnore
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

}
