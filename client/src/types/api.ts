/**
 * Standard backend response metadata for paginated lists
 */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  totalPages?: number;
}

/**
 * Standard backend success envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
}

/**
 * Standard backend error envelope
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  name?: string;
  error?: unknown;
}

/**
 * Common query params for pagination & sorting
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

