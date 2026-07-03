// lib/types/common.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared utility types used across repositories and services.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generic paginated response wrapper.
 * Used as the return type for any list query.
 *
 * @example
 *   const result: PaginatedResult<UserListItem> = await userRepository.list(...)
 */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/**
 * Pagination input – passed into list() methods.
 * Both fields are optional; repositories apply sensible defaults (page=1, perPage=20).
 */
export interface PaginationInput {
  page?: number;
  perPage?: number;
}

/**
 * Generic ordering input.
 * TField is a union of the valid sortable column names for a given model.
 *
 * @example
 *   type UserOrderField = 'name' | 'email' | 'createdAt'
 *   const order: OrderInput<UserOrderField> = { orderBy: 'createdAt', orderDirection: 'desc' }
 */
export interface OrderInput<TField extends string = string> {
  orderBy?: TField;
  orderDirection?: "asc" | "desc";
}
