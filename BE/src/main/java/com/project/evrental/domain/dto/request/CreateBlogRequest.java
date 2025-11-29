package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBlogRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    String title;

    @NotBlank(message = "Content is required")
    @Size(min = 50, message = "Content must be at least 50 characters")
    String content;

    String thumbnailUrl;

    Boolean published;
}
