package com.project.evrental.scheduled;

import com.project.evrental.domain.dto.response.OauthState;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OauthStateScheduled {

    @NonFinal
    @Value("${oauth.state.prefix}")
    String state_prefix;

    RedisTemplate<String, Object> redis;

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupExpiredStates() {
        try {
            var keys = redis.keys(state_prefix + "*");
            if (!keys.isEmpty()) {
                var deleted = keys.stream().filter(
                        key -> {
                            OauthState oauthState = (OauthState) redis.opsForValue().get(key);
                            return oauthState != null && oauthState.isExpired();
                        }
                ).peek(redis::delete).count();

                if (deleted > 0) {
                    log.info("Cleaned up {} expired OAuth states", deleted);
                }

            }
        } catch (Exception e) {
            log.error("Error cleaning up expired states", e);
        }
    }

}
