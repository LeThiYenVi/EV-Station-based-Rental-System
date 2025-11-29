package com.project.evrental.mapper;

import com.project.evrental.domain.dto.response.BlogResponse;
import com.project.evrental.domain.entity.Blog;

public class BlogMapper {

    private BlogMapper() {}

    public static BlogResponse toResponse(Blog blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .thumbnailUrl(blog.getThumbnailUrl())
                .authorId(blog.getAuthor().getId())
                .authorName(blog.getAuthor().getFullName())
                .published(blog.getPublished())
                .viewCount(blog.getViewCount())
                .publishedAt(blog.getPublishedAt())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }
}
