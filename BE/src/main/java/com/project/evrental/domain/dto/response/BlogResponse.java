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
public class BlogResponse {

    UUID id;

    String title;

    String content;

    String thumbnailUrl;

    UUID authorId;

    String authorName;

    Boolean published;

    Integer viewCount;

    LocalDateTime publishedAt;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
