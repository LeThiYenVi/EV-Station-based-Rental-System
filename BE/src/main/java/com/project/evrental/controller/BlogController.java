package com.project.evrental.controller;

import com.project.evrental.domain.ApiResponse;
import com.project.evrental.domain.dto.request.CreateBlogRequest;
import com.project.evrental.domain.dto.request.UpdateBlogRequest;
import com.project.evrental.domain.dto.response.BlogResponse;
import com.project.evrental.service.BlogService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogController {

    BlogService blogService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BlogResponse>> createBlog(
            @Valid @RequestBody CreateBlogRequest request
    ) {
        log.info("Request to create blog: {}", request.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BlogResponse>builder()
                        .statusCode(201)
                        .message("Blog created successfully")
                        .data(blogService.createBlog(request))
                        .build());
    }

    @PutMapping("/{blogId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BlogResponse>> updateBlog(
            @PathVariable UUID blogId,
            @Valid @RequestBody UpdateBlogRequest request
    ) {
        log.info("Request to update blog: {}", blogId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BlogResponse>builder()
                        .statusCode(200)
                        .message("Blog updated successfully")
                        .data(blogService.updateBlog(blogId, request))
                        .build());
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogById(
            @PathVariable UUID blogId
    ) {
        log.info("Request to get blog: {}", blogId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BlogResponse>builder()
                        .statusCode(200)
                        .data(blogService.getBlogById(blogId))
                        .build());
    }

    @PostMapping("/{blogId}/view")
    public ResponseEntity<ApiResponse<BlogResponse>> incrementViewCount(
            @PathVariable UUID blogId
    ) {
        log.info("Request to increment view count for blog: {}", blogId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BlogResponse>builder()
                        .statusCode(200)
                        .data(blogService.incrementViewCount(blogId))
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BlogResponse>>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get all blogs - page: {}, size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<BlogResponse>>builder()
                        .statusCode(200)
                        .data(blogService.getAllBlogs(pageable))
                        .build());
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<Page<BlogResponse>>> getPublishedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        log.info("Request to get published blogs - page: {}, size: {}", page, size);
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Page<BlogResponse>>builder()
                        .statusCode(200)
                        .data(blogService.getPublishedBlogs(pageable))
                        .build());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<BlogResponse>>> getMyBlogs() {
        log.info("Request to get my blogs");
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BlogResponse>>builder()
                        .statusCode(200)
                        .data(blogService.getMyBlogs())
                        .build());
    }

    @GetMapping("/top-viewed")
    public ResponseEntity<ApiResponse<List<BlogResponse>>> getTopViewedBlogs(
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Request to get top {} viewed blogs", limit);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BlogResponse>>builder()
                        .statusCode(200)
                        .data(blogService.getTopViewedBlogs(limit))
                        .build());
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<BlogResponse>>> getRecentBlogs(
            @RequestParam(defaultValue = "5") int limit
    ) {
        log.info("Request to get {} recent blogs", limit);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<BlogResponse>>builder()
                        .statusCode(200)
                        .data(blogService.getRecentBlogs(limit))
                        .build());
    }

    @DeleteMapping("/{blogId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @PathVariable UUID blogId
    ) {
        log.info("Request to delete blog: {}", blogId);
        blogService.deleteBlog(blogId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .statusCode(200)
                        .message("Blog deleted successfully")
                        .build());
    }

    @PostMapping(value = "/{blogId}/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<BlogResponse>> uploadThumbnail(
            @PathVariable UUID blogId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Request to upload thumbnail for blog: {}", blogId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<BlogResponse>builder()
                        .statusCode(200)
                        .message("Thumbnail uploaded successfully")
                        .data(blogService.uploadThumbnail(blogId, file))
                        .build());
    }
}
