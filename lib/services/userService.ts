import * as userRepository from "@/lib/repositories/userRepository";
import { PublicUser } from "@/lib/models/user";

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
