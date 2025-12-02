// ==========================================
// Blog Types
// Type definitions for blog API
// ==========================================

/**
 * Blog response interface
 */
export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  authorId: string;
  authorName: string;
  published: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog detail response interface (same as BlogResponse for now)
 */
export interface BlogDetailResponse extends BlogResponse {}

/**
 * Blog filters interface for pagination and sorting
 */
export interface BlogFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Paginated response for blogs
 */
export interface BlogPageResponse {
  content: BlogResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
