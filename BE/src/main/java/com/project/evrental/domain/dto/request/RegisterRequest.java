package com.project.evrental.domain.dto.request;

import com.project.evrental.domain.common.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @Email
    @NotBlank(message = "Email is not blank!")
    String email;

    @NotBlank(message = "Full name is not blank!")
    String fullName;

    @NotBlank(message = "Phone is not blank!")
    String phone;

    String address;

    @Length(min = 8, max = 20)
    String password;

    @Length(min = 8, max = 20)
    String confirmPassword;

    String role = UserRole.RENTER.toString();

}
