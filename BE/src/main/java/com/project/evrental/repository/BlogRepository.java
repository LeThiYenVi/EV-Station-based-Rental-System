package com.project.evrental.repository;

import com.project.evrental.domain.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {

    Page<Blog> findByPublishedTrue(Pageable pageable);

    List<Blog> findByAuthorIdOrderByCreatedAtDesc(UUID authorId);

    @Query("SELECT b FROM Blog b WHERE b.published = true ORDER BY b.viewCount DESC")
    List<Blog> findTopViewedBlogs(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.published = true ORDER BY b.publishedAt DESC")
    List<Blog> findRecentPublishedBlogs(Pageable pageable);
}
