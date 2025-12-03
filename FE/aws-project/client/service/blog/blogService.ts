// ==========================================
// Blog Service
// Handles blog operations
// ==========================================

import apiClient from "../api/apiClient";
import type {
  BlogResponse,
  BlogDetailResponse,
  BlogFilters,
  BlogPageResponse,
} from "../types/blog.types";

// API Endpoints for blogs
const BLOG_ENDPOINTS = {
  GET_ALL: "/blogs",
  GET_BY_ID: "/blogs/:blogId",
  CREATE: "/blogs",
  UPDATE: "/blogs/:blogId",
  DELETE: "/blogs/:blogId",
};

class BlogService {
  /**
   * Get all blogs with pagination
   * @param filters - Pagination and sorting options
   * @returns Paginated blog list
   */
  async getAllBlogs(filters?: BlogFilters): Promise<BlogPageResponse> {
    const params = new URLSearchParams();

    if (filters?.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters?.size !== undefined)
      params.append("size", filters.size.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDirection)
      params.append("sortDirection", filters.sortDirection);

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
    const url = BLOG_ENDPOINTS.GET_BY_ID.replace(":blogId", blogId);
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
    result.content = result.content.filter((blog) => blog.published);
    return result;
  }

  /**
   * Create a new blog
   * @param data - Blog creation data
   * @returns Created blog response
   */
  async createBlog(data: {
    title: string;
    content: string;
    thumbnailUrl?: string;
    published?: boolean;
  }): Promise<BlogResponse> {
    const response = await apiClient.post(BLOG_ENDPOINTS.CREATE, data);
    return response.data;
  }

  /**
   * Update an existing blog
   * @param blogId - Blog UUID
   * @param data - Blog update data
   * @returns Updated blog response
   */
  async updateBlog(
    blogId: string,
    data: {
      title?: string;
      content?: string;
      thumbnailUrl?: string;
      published?: boolean;
    },
  ): Promise<BlogResponse> {
    const url = BLOG_ENDPOINTS.UPDATE.replace(":blogId", blogId);
    const response = await apiClient.put(url, data);
    return response.data;
  }

  /**
   * Delete a blog
   * @param blogId - Blog UUID
   */
  async deleteBlog(blogId: string): Promise<void> {
    const url = BLOG_ENDPOINTS.DELETE.replace(":blogId", blogId);
    await apiClient.delete(url);
  }
}

// Export singleton instance
const blogService = new BlogService();
export default blogService;
