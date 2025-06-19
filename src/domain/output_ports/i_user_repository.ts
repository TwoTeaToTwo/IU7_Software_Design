import type { Password, User } from "../models/user.ts";
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
	 * Return true on success
	 */
	save(user: User): Promise<boolean>;
	/**
	 * Return User if can find, else null
	 */
	findByLogin(user_login: string): Promise<User | null>;
	/**
	 * Return User on success, else null
	 */
	create(login: string, password: Password): Promise<User | null>;
}
