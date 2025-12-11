package com.project.evrental.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.location.LocationClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.auth.StsAssumeRoleCredentialsProvider;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;

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

    @Value("${aws.location.cross-account-role-arn}")
    private String crossAccountRoleArn;

//    @Bean
//    public CognitoIdentityProviderClient cognitoClient() {
//        return CognitoIdentityProviderClient.builder()
//                .region(Region.of(region))
//                .credentialsProvider(
//                        StaticCredentialsProvider.create(
//                                AwsBasicCredentials.create(cognito_accessKey, cognito_secretKey)
//                        )
//                )
//                .build();
//    }

        @Bean
    public CognitoIdentityProviderClient cognitoIdentityProviderClient() {
        return CognitoIdentityProviderClient.builder()
                .region(Region.of(region))
                // SDK tự động lấy credentials từ IAM Role của server (qua STS)
                .credentialsProvider(DefaultCredentialsProvider.create())
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


    @Bean
    public LocationClient locationClient() {
        // 1. Tạo STS Client (Dùng quyền của ECS Account A để gọi STS)
        StsClient stsClient = StsClient.builder()
                .region(Region.AP_SOUTHEAST_1)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        // 2. Tạo Provider tự động Assume Role sang Account B
        StsAssumeRoleCredentialsProvider crossAccountProvider = StsAssumeRoleCredentialsProvider.builder()
                .stsClient(stsClient)
                .refreshRequest(AssumeRoleRequest.builder()
                        .roleArn(crossAccountRoleArn)
                        .roleSessionName("EvRentalLocationSession") // Tên session tùy ý
                        .build())
                .build();

        // 3. Tạo Location Client dùng Provider đã "Switch Role" này
        return LocationClient.builder()
                .region(Region.AP_SOUTHEAST_1) // region của Account B
                .credentialsProvider(crossAccountProvider)
                .build();
    }
}
