package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .cognitoSub(user.getCognitoSub())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .licenseNumber(user.getLicenseNumber())
                .identityNumber(user.getIdentityNumber())
                .licenseCardFrontImageUrl(user.getLicenseCardFrontImageUrl())
                .licenseCardBackImageUrl(user.getLicenseCardBackImageUrl())
                .isLicenseVerified(user.getIsLicenseVerified())
                .verifiedAt(user.getVerifiedAt())
                .stationId(user.getStationId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public static UserResponse fromEntityWithStats(User user, Long totalBookings, 
                                                     Long completedBookings, Long activeBookings, 
                                                     Long cancelledBookings) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .cognitoSub(user.getCognitoSub())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .licenseNumber(user.getLicenseNumber())
                .identityNumber(user.getIdentityNumber())
                .licenseCardFrontImageUrl(user.getLicenseCardFrontImageUrl())
                .licenseCardBackImageUrl(user.getLicenseCardBackImageUrl())
                .isLicenseVerified(user.getIsLicenseVerified())
                .verifiedAt(user.getVerifiedAt())
                .stationId(user.getStationId())
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .activeBookings(activeBookings)
                .cancelledBookings(cancelledBookings)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    // Instance methods for dependency injection
    public UserResponse toResponse(User user) {
        return fromEntity(user);
    }

    public UserResponse toUserResponse(User user) {
        return fromEntity(user);
    }

}
