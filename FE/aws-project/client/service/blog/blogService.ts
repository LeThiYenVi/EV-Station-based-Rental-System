// ==========================================
// Blog Service
// Handles blog operations
// ==========================================

import apiClient from '../api/apiClient';
import type {
  BlogResponse,
  BlogDetailResponse,
  BlogFilters,
  BlogPageResponse,
} from '../types/blog.types';

// API Endpoints for blogs
const BLOG_ENDPOINTS = {
  GET_ALL: '/blogs',
  GET_BY_ID: '/blogs/:blogId',
};

class BlogService {
  /**
   * Get all blogs with pagination
   * @param filters - Pagination and sorting options
   * @returns Paginated blog list
   */
  async getAllBlogs(filters?: BlogFilters): Promise<BlogPageResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

    const queryString = params.toString();
    const url = queryString 
      ? `${BLOG_ENDPOINTS.GET_ALL}?${queryString}`
      : BLOG_ENDPOINTS.GET_ALL;

    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get blog by ID
   * @param blogId - Blog UUID
   * @returns Blog detail information
   */
  async getBlogById(blogId: string): Promise<BlogDetailResponse> {
    const url = BLOG_ENDPOINTS.GET_BY_ID.replace(':blogId', blogId);
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Get published blogs only (filtered on client side or can be extended)
   * @param filters - Pagination and sorting options
   * @returns Paginated blog list with only published blogs
   */
  async getPublishedBlogs(filters?: BlogFilters): Promise<BlogPageResponse> {
    const result = await this.getAllBlogs(filters);
    // Filter to only include published blogs
    result.content = result.content.filter(blog => blog.published);
    return result;
  }
}

// Export singleton instance
const blogService = new BlogService();
export default blogService;
