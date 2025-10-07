package com.project.evrental.domain;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    int statusCode;

    String message;

    T data;

    LocalDateTime responseAt = LocalDateTime.now();
}
