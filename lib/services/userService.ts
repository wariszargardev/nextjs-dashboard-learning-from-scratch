import * as userRepository from "@/lib/repositories/userRepository";
import { PublicUser, UserFilter, UserListItem, UserRole } from "@/lib/models/user";
import { PaginatedResult, PaginationInput, OrderInput } from "@/lib/types/common";

/**
 * Fetch a single user by ID.
 * Returns null if not found – callers decide whether to 404.
 */
export async function getUserById(id: string): Promise<PublicUser | null> {
  return userRepository.findById(id);
}

/**
 * Fetch a single user by email.
 * Returns null if not found – callers decide whether to 404.
 */
export async function getUserByEmail(email: string): Promise<PublicUser | null> {
  return userRepository.findByEmail(email);
}

type ListUsersOptions = PaginationInput &
  OrderInput<"name" | "email" | "createdAt"> &
  UserFilter;

/**
 * Returns a paginated, filtered, sorted list of users.
 * Business rule: defaults to page 1, 20 per page, newest first.
 */
export async function listUsers(
  options: ListUsersOptions = {}
): Promise<PaginatedResult<UserListItem>> {
  const { page, perPage, orderBy, orderDirection, ...filter } = options;
  return userRepository.list({ page, perPage, orderBy, orderDirection, filter });
}

 
/**
 * Create a new user.
 * Business rule: role defaults to USER if not provided.
 * TODO: add duplicate-email check / throw a domain error here.
 */
export async function createUser(input: {
  name: string;
  email: string;
  role?: UserRole;
}): Promise<PublicUser> {
  // Future: validate email format, check for existing user, hash password, etc.
  return userRepository.create(input);
}
