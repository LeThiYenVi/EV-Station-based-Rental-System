package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateBlogRequest {

    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    String title;

    @Size(min = 50, message = "Content must be at least 50 characters")
    String content;

    String thumbnailUrl;

    Boolean published;
}
