//package com.project.evrental.config;
//
//import lombok.AccessLevel;
//import lombok.Data;
//import lombok.experimental.FieldDefaults;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
//import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
//import software.amazon.awssdk.regions.Region;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.presigner.S3Presigner;
//
//@Data
//@Configuration
//@ConfigurationProperties(prefix = "aws.s3")
//@FieldDefaults(level = AccessLevel.PRIVATE)
//public class S3Config {
//
//    String bucketName;
//
//    String region;
//
//    String accessKey;
//
//    String secretKey;
//
//    String basePath;
//
//    @Bean
//    public S3Client s3Client() {
//        AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(accessKey, secretKey);
//        return S3Client.builder()
//                .region(Region.of(region))
//                .credentialsProvider(StaticCredentialsProvider.create((awsBasicCredentials)))
//                .build();
//    }
//
//    @Bean
//    public S3Presigner s3Presigner() {
//        AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(accessKey, secretKey);
//        return S3Presigner.builder()
//                .region(Region.of(region))
//                .credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials))
//                .build();
//    }
//}
