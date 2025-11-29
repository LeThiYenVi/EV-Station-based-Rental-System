package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    UUID id;

    String email;

    String fullName;

    String phone;

    String address;

    String cognitoSub;

    String avatarUrl;

    String role;

    String licenseNumber;

    String identityNumber;

    String licenseCardFrontImageUrl;

    String licenseCardBackImageUrl;

    Boolean isLicenseVerified;

    LocalDateTime verifiedAt;

    UUID stationId;

    // Booking statistics
    Long totalBookings;

    Long completedBookings;

    Long activeBookings;

    Long cancelledBookings;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
