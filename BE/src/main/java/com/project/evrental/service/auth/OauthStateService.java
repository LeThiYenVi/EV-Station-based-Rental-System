package com.project.evrental.service.auth;

import com.project.evrental.domain.dto.response.OauthState;
import com.project.evrental.exception.custom.InvalidStateException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OauthStateService {

    RedisTemplate<String, Object> redis;

    @NonFinal
    @Value("${oauth.state.prefix}")
    String state_prefix;

    @NonFinal
    @Value("${oauth.state.ttl}")
    int ttl_minutes;

    public OauthState generateAndSaveState() {
        String state = generateSecureState();

        OauthState oauthState = OauthState.builder()
                .state(state)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(ttl_minutes))
                .build();

//        String key = state_prefix + state;
//        redis.opsForValue().set(key, oauthState, ttl_minutes, TimeUnit.MINUTES);
        return oauthState;
    }

//    public OauthState validateAndConsumeState(String stateValue) {
//        if(stateValue == null || stateValue.isBlank()) {
//            throw new InvalidStateException("State parameter is missing");
//        }
//
//        String key = state_prefix + stateValue;
//        OauthState oauthState = (OauthState) redis.opsForValue().get(key);
//        if(oauthState == null || !oauthState.getState().equals(stateValue)) {
//            log.warn("Invalid or expired state: {}", stateValue);
//            throw new InvalidStateException(
//                    "Invalid or expired state parameter. Please try again."
//            );
//        }
//
//        redis.delete(key);
//        return oauthState;
//    }

    private String generateSecureState() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

}
