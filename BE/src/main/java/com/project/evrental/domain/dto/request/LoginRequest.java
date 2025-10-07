package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {

    @Email
    @NotBlank(message = "Email is not empty!")
    String email;

    @NotBlank(message = "Password is not empty!")
    String password;


}
