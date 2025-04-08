import type { User } from "../models/user.ts";
import type { Id } from "../types.ts";

export interface IUserRepository {
	delete(user: User): void;
	findById(user_id: Id): User;
	save(user: User): void;
}
