import { createUInt, User } from "@podcast/domain";
import type { Id, IUserRepository } from "@podcast/domain";
import type { PostgresDB } from "../database.ts";
import { inject, injectable } from "npm:inversify";
import { INJECT_TYPES } from "../types.ts";
import { users } from "../schema.ts";
import { eq } from "drizzle-orm";
import { Password } from "../../../domain/models/user.ts";

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(INJECT_TYPES.NodePgDatabase) private _db: PostgresDB) {}
	/**
	 * Return true on success
	 */
	public async delete(user: User): Promise<boolean> {
		let is_deleted = true;
		const result = await this._db.delete(users).where(
			eq(users.id, user.id),
		);
		if (result.rowCount === 0) {
			is_deleted = false;
		}
		return is_deleted;
	}
	/**
	 * Return User if can find, else null
	 */
	public async findById(user_id: Id): Promise<User | null> {
		const result = await this._db.select().from(users).where(
			eq(users.id, user_id),
		);
		let user: User | null;
		if (result.length === 0) {
			user = null;
		} else {
			const _user = result[0];
			user = new User(
				createUInt(_user.id),
				_user.login,
				new Password(_user.password),
			);
		}
		return user;
	}
	/**
	 * Return true on success, insert or update password
	 */
	public async save(user: User): Promise<boolean> {
        let is_edited = true;
		const result = await this._db.insert(users).values({
			id: user.id,
			login: user.login,
			password: user.password.password,
		}).onConflictDoUpdate({
			target: users.id,
			set: { password: user.password.password },
		});
        if (result.rowCount === 0)
            is_edited = false;
        return is_edited;
	}
	/**
	 * Return User if can find, else null
	 */
	public async findByLogin(user_login: string): Promise<User | null>
    {
        const result = await this._db.select().from(users).where(eq(users.login, user_login));
        let user: User | null;
        if (result.length === 0) {
			user = null;
		} else {
			const _user = result[0];
			user = new User(
				createUInt(_user.id),
				_user.login,
				new Password(_user.password),
			);
		}
		return user;
    }
}
