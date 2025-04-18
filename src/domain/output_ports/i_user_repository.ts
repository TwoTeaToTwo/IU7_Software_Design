import type { User } from "../models/user.ts";
import type { Id } from "../types.ts";

export interface IUserRepository {
	/**
	 * Return true on success
	 */
	delete(user: User): boolean;
	/**
	 * Return User if can find, else null
	 */
	findById(user_id: Id): User | null;
	/**
	 * Return true on success
	 */
	save(user: User): boolean;
	/**
	 * Return User if can find, else null
	 */
	findByLogin(user_login: string): User | null;
}
