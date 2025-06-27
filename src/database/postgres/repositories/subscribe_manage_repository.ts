import { createUInt, Subscribe } from "@podcast/domain";
import type { Id, ISubscribeManageRepository } from "@podcast/domain";
import type { PostgresDB } from "../database.ts";
import { inject, injectable } from "npm:inversify";
import { INJECT_TYPES } from "../types.ts";
import { subscriptions, users, usersHaveSubscriptions } from "../schema.ts";
import { and, eq } from "npm:drizzle-orm";

@injectable()
export class SubscribeManageRepository implements ISubscribeManageRepository {
	constructor(@inject(INJECT_TYPES.NodePgDatabase) private _db: PostgresDB) {}
	/**
	 * Return null if user doesn't exist
	 */
	public async findSubscribesByUserId(
		user_id: Id,
	): Promise<Array<Subscribe> | null> {
		const result = await this._db.select({
			id: subscriptions.id,
			url: subscriptions.url,
			title: subscriptions.title,
			platform: subscriptions.platform,
		}).from(subscriptions).innerJoin(
			usersHaveSubscriptions,
			eq(usersHaveSubscriptions.subscription_id, subscriptions.id),
		).where(eq(usersHaveSubscriptions.user_id, user_id));
		let subscribes: Array<Subscribe> | null;
		if (result.length === 0) {
			subscribes = null;
		} else {
			subscribes = new Array<Subscribe>();
			for (const record of result) {
				subscribes.push(
					new Subscribe(
						createUInt(record.id),
						new URL(record.url),
						record.title,
						record.platform,
					),
				);
			}
		}
		return subscribes;
	}
	/**
	 * Return true on success
	 * Subscribe user on source
	 */
	public async subscribe(user_id: Id, subscribe_id: Id): Promise<boolean> {
		let is_inserted: boolean;
		const userExists = await this._db.select().from(users).where(
			eq(users.id, user_id),
		);
		const subExists = await this._db.select().from(subscriptions).where(
			eq(subscriptions.id, subscribe_id),
		);
		if (userExists.length === 0 || subExists.length === 0) {
			is_inserted = false;
		} else {
			const result = await this._db.insert(usersHaveSubscriptions).values(
				{
					user_id: user_id,
					subscription_id: subscribe_id,
				},
			).onConflictDoNothing();
			is_inserted = result.rowCount !== 0;
		}
		return is_inserted;
	}
	/**
	 * Return true on success
	 * Unsubscribe user from source
	 */
	public async unsubscribe(user_id: Id, subscribe_id: Id): Promise<boolean> {
		const result = await this._db.delete(usersHaveSubscriptions).where(
			and(
				eq(usersHaveSubscriptions.user_id, user_id),
				eq(usersHaveSubscriptions.subscription_id, subscribe_id),
			),
		);
		return result.rowCount !== 0;
	}
}
