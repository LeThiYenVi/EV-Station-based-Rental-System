package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {

    @Size(min = 3, max = 255, message = "Full name must be between 3 and 255 characters")
    String fullName;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits")
    String phone;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    String address;

    @Size(min = 5, max = 50, message = "License number must be between 5 and 50 characters")
    String licenseNumber;

    @Size(min = 9, max = 20, message = "Identity number must be between 9 and 20 characters")
    String identityNumber;

    UUID stationId;
}
