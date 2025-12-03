// ==========================================
// useBlog Hook
// React hook for blog operations
// ==========================================

import { useState, useCallback } from 'react';
import blogService from '../service/blog/blogService';
import type {
  BlogResponse,
  BlogDetailResponse,
  BlogFilters,
  BlogPageResponse,
} from '../service/types/blog.types';

export interface UseBlogReturn {
  loading: boolean;
  error: string | null;
  blogs: BlogResponse[];
  currentBlog: BlogDetailResponse | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null;
  getAllBlogs: (filters?: BlogFilters) => Promise<{ success: boolean; data?: BlogPageResponse; error?: string }>;
  getBlogById: (blogId: string) => Promise<{ success: boolean; data?: BlogDetailResponse; error?: string }>;
  getPublishedBlogs: (filters?: BlogFilters) => Promise<{ success: boolean; data?: BlogPageResponse; error?: string }>;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

export const useBlog = (): UseBlogReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [currentBlog, setCurrentBlog] = useState<BlogDetailResponse | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null>(null);

  const getAllBlogs = useCallback(async (filters?: BlogFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAllBlogs(filters);
      setBlogs(data.content);
      setPagination({
        page: data.page.number,
        size: data.page.size,
        totalElements: data.page.totalElements,
        totalPages: data.page.totalPages,
      });
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách bài viết';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogById = useCallback(async (blogId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogById(blogId);
      setCurrentBlog(data);
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin bài viết';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublishedBlogs = useCallback(async (filters?: BlogFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPublishedBlogs(filters);
      setBlogs(data.content);
      setPagination({
        page: data.page.number,
        size: data.page.size,
        totalElements: data.page.totalElements,
        totalPages: data.page.totalPages,
      });
      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách bài viết';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentBlog = useCallback(() => {
    setCurrentBlog(null);
  }, []);

  return {
    loading,
    error,
    blogs,
    currentBlog,
    pagination,
    getAllBlogs,
    getBlogById,
    getPublishedBlogs,
    clearError,
    clearCurrentBlog,
  };
};

export default useBlog;
