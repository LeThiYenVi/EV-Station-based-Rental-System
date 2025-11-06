package com.project.evrental.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsClientConfig {

    @Value("${aws.cognito.region}")
    private String region;

    @Value("${aws.cognito.cognito-access-key}")
    private String cognito_accessKey;

    @Value("${aws.cognito.cognito-secret-key}")
    private String cognito_secretKey;

    @Value("${aws.s3.s3-access-key}")
    private String s3_accessKey;

    @Value("${aws.s3.s3-secret-key}")
    private String s3_secretKey;

    @Bean
    public CognitoIdentityProviderClient cognitoClient() {
        return CognitoIdentityProviderClient.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(cognito_accessKey, cognito_secretKey)
                        )
                )
                .build();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(s3_accessKey, s3_secretKey)
                        )
                )
                .build();
    }
}
