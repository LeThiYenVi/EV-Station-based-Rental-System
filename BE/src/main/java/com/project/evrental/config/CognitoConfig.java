package com.project.evrental.config;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "aws.cognito")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CognitoConfig {

    String clientId;

    String clientSecret;

    String userPoolId;

    String region;

    String domainPrefix;

    String urlCallback;

}
