// API Response Wrapper
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  responseAt: string;
}

// Pagination Types
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}

// Common Query Parameters
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}
