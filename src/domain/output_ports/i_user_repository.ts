import type { User } from "../models/user.ts";
import type { Id } from "../types.ts";

export interface IUserRepository {
	/**
	 * Return true on success
	 */
	delete(user: User): Promise<boolean>;
	/**
	 * Return User if can find, else null
	 */
	findById(user_id: Id): Promise<User | null>;
	/**
	 * Return true on success, insert or update password
	 */
	save(user: User): Promise<boolean>;
	/**
	 * Return User if can find, else null
	 */
	findByLogin(user_login: string): Promise<User | null>;
}
