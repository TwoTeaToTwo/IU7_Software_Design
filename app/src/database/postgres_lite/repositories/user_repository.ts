import { createUInt, Password, User } from "@podcast/core";
import type { Id, IUserRepository } from "@podcast/core";
import type { PostgresLiteDB } from "../database.ts";
import { inject, injectable } from "inversify";
import { INJECT_TYPES } from "../types.ts";
import { users } from "../schema.ts";
import { eq } from "drizzle-orm";

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(INJECT_TYPES.NodePgDatabase) private _db: PostgresLiteDB,
	) {}
	/**
	 * Return true on success
	 */
	public async delete(user: User): Promise<boolean> {
		const result = await this._db.delete(users).where(
			eq(users.id, user.id),
		);
		return result.affectedRows !== 0;
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
	 * Return true on success
	 */
	public async save(user: User): Promise<boolean> {
		const result = await this._db.update(users).set({
			login: user.login,
			password: user.password.password,
		}).where(eq(users.id, user.id));
		return result.affectedRows !== 0;
	}
	/**
	 * Return User if can find, else null
	 */
	public async findByLogin(user_login: string): Promise<User | null> {
		const result = await this._db.select().from(users).where(
			eq(users.login, user_login),
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
	 * Return User on success, else null
	 */
	public async create(
		login: string,
		password: Password,
	): Promise<User | null> {
		let user: User | null;
		const result = await this._db.insert(users).values({
			login: login,
			password: password.password,
		}).onConflictDoNothing().returning();
		if (result.length === 0) {
			user = null;
		} else {
			const record = result[0];
			user = new User(
				createUInt(record.id),
				record.login,
				new Password(record.password),
			);
		}
		return user;
	}
}
