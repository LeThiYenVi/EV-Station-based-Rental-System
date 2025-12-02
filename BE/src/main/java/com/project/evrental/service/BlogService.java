package com.project.evrental.service;

import com.project.evrental.domain.dto.request.CreateBlogRequest;
import com.project.evrental.domain.dto.request.UpdateBlogRequest;
import com.project.evrental.domain.dto.response.BlogResponse;
import com.project.evrental.domain.entity.Blog;
import com.project.evrental.domain.entity.User;
import com.project.evrental.exception.custom.ResourceNotFoundException;
import com.project.evrental.mapper.BlogMapper;
import com.project.evrental.repository.BlogRepository;
import com.project.evrental.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogService {

    BlogRepository blogRepository;
    UserRepository userRepository;
    S3Service s3Service;

    @Transactional
    public BlogResponse createBlog(CreateBlogRequest request) {
        log.info("Creating blog with title: {}", request.getTitle());

        String email = getEmailFromAuthentication();
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .thumbnailUrl(request.getThumbnailUrl())
                .author(author)
                .published(request.getPublished() != null ? request.getPublished() : false)
                .viewCount(0)
                .publishedAt(request.getPublished() != null && request.getPublished() ? LocalDateTime.now() : null)
                .build();

        Blog savedBlog = blogRepository.save(blog);
        log.info("Blog created with ID: {}", savedBlog.getId());

        return BlogMapper.toResponse(savedBlog);
    }

    @Transactional
    public BlogResponse updateBlog(UUID blogId, UpdateBlogRequest request) {
        log.info("Updating blog with ID: {}", blogId);

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        boolean wasUnpublished = !blog.getPublished();

        if (request.getTitle() != null) {
            blog.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            blog.setContent(request.getContent());
        }
        if (request.getThumbnailUrl() != null) {
            blog.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getPublished() != null) {
            blog.setPublished(request.getPublished());
            if (wasUnpublished && request.getPublished()) {
                blog.setPublishedAt(LocalDateTime.now());
            }
        }

        Blog updatedBlog = blogRepository.save(blog);
        log.info("Blog updated successfully: {}", blogId);

        return BlogMapper.toResponse(updatedBlog);
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogById(UUID blogId) {
        log.info("Fetching blog with ID: {}", blogId);
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));
        return BlogMapper.toResponse(blog);
    }

    @Transactional
    public BlogResponse incrementViewCount(UUID blogId) {
        log.info("Incrementing view count for blog: {}", blogId);
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));
        
        blog.setViewCount(blog.getViewCount() + 1);
        Blog updatedBlog = blogRepository.save(blog);
        
        return BlogMapper.toResponse(updatedBlog);
    }

    @Transactional(readOnly = true)
    public Page<BlogResponse> getAllBlogs(Pageable pageable) {
        log.info("Fetching all blogs with pagination");
        Page<Blog> blogs = blogRepository.findAll(pageable);
        return blogs.map(BlogMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<BlogResponse> getPublishedBlogs(Pageable pageable) {
        log.info("Fetching published blogs with pagination");
        Page<Blog> blogs = blogRepository.findByPublishedTrue(pageable);
        return blogs.map(BlogMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getMyBlogs() {
        log.info("Fetching blogs for current user");
        String email = getEmailFromAuthentication();
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Blog> blogs = blogRepository.findByAuthorIdOrderByCreatedAtDesc(author.getId());
        return blogs.stream()
                .map(BlogMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getTopViewedBlogs(int limit) {
        log.info("Fetching top {} viewed blogs", limit);
        Pageable pageable = PageRequest.of(0, limit);
        List<Blog> blogs = blogRepository.findTopViewedBlogs(pageable);
        return blogs.stream()
                .map(BlogMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlogResponse> getRecentBlogs(int limit) {
        log.info("Fetching {} recent blogs", limit);
        Pageable pageable = PageRequest.of(0, limit);
        List<Blog> blogs = blogRepository.findRecentPublishedBlogs(pageable);
        return blogs.stream()
                .map(BlogMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBlog(UUID blogId) {
        log.info("Deleting blog with ID: {}", blogId);
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        if (blog.getThumbnailUrl() != null) {
            s3Service.deleteFile(blog.getThumbnailUrl());
        }

        blogRepository.delete(blog);
        log.info("Blog deleted successfully: {}", blogId);
    }

    @Transactional
    public BlogResponse uploadThumbnail(UUID blogId, MultipartFile file) {
        log.info("Uploading thumbnail for blog: {}", blogId);
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + blogId));

        if (blog.getThumbnailUrl() != null) {
            s3Service.deleteFile(blog.getThumbnailUrl());
        }

        String thumbnailUrl = s3Service.uploadFile(file, "assets/blog-thumbnails");
        blog.setThumbnailUrl(thumbnailUrl);

        Blog updatedBlog = blogRepository.save(blog);
        return BlogMapper.toResponse(updatedBlog);
    }

    private String getEmailFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String sub = jwt.getClaimAsString("sub");
            if (sub != null) {
                log.debug("Using sub claim as cognito_sub: {}", sub);
                User user = userRepository.findByCognitoSub(sub).orElse(null);
                if (user != null) {
                    return user.getEmail();
                }
            }
        }
        return authentication != null ? authentication.getName() : null;
    }
}
