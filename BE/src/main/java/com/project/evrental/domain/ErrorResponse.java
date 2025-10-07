package com.project.evrental.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ErrorResponse<T> {

    int statusCode;

    String message;

    T errors;

    LocalDateTime responseAt = LocalDateTime.now();

}
