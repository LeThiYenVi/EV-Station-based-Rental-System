package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.UserResponse;
import com.project.evrental.domain.entity.User;

public class UserMapper {

    private UserMapper() {}

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .cognitoSub(user.getCognitoSub())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .licenseNumber(user.getLicenseNumber())
                .identityNumber(user.getIdentityNumber())
                .licenseCardImageUrl(user.getLicenseCardImageUrl())
                .isLicenseVerified(user.getIsLicenseVerified())
                .verifiedAt(user.getVerifiedAt())
                .stationId(user.getStationId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

}
