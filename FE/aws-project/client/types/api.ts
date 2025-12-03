/**
 * API Response Types
 * Định nghĩa cấu trúc response chung của backend
 */

/**
 * ApiResponse<T> - Wrapper chung cho tất cả API responses
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  data: T;
  responseAt: string; // ISO-8601 datetime
}

/**
 * Error Response - Khi API trả về lỗi
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
}

/**
 * Pagination Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
