import { createUInt, Subscribe } from "@podcast/domain";
import type { Id, ISubscribeRepository } from "@podcast/domain";
import type { PostgresDB } from "../database.ts";
import { inject, injectable } from "npm:inversify";
import { INJECT_TYPES } from "../types.ts";
import { subscriptions, usersHaveSubscriptions } from "../schema.ts";
import { eq } from "drizzle-orm";

@injectable()
export class SubscribeRepository implements ISubscribeRepository {
	constructor(@inject(INJECT_TYPES.NodePgDatabase) private _db: PostgresDB) {}
	/**
	 * Return true on success
	 */
	public async delete(subscribe: Subscribe): Promise<boolean> {
		const result = await this._db.delete(subscriptions).where(
			eq(subscriptions.id, subscribe.id),
		);
		return result.rowCount === 0;
	}
	/**
	 * Return Subscribe if can find, else null
	 */
	public async findById(subscribe_id: Id): Promise<Subscribe | null> {
		const result = await this._db.select().from(subscriptions).where(
			eq(subscriptions.id, subscribe_id),
		);
		let subscribe: Subscribe | null;
		if (result.length === 0) {
			subscribe = null;
		} else {
			const _subscribe = result[0];
			subscribe = new Subscribe(
				createUInt(_subscribe.id),
				new URL(_subscribe.url),
				_subscribe.title,
				_subscribe.platform,
			);
		}
		return subscribe;
	}
	/**
	 * Return true on success
	 */
	public async save(subscribe: Subscribe): Promise<boolean> {
		const result = await this._db.insert(subscriptions).values({
			id: subscribe.id,
			url: subscribe.url.toString(),
			title: subscribe.title,
			platform: subscribe.platform,
		}).onConflictDoUpdate({
			target: subscriptions.id,
			set: {
				url: subscribe.url.toString(),
				title: subscribe.title,
				platform: subscribe.platform,
			},
		});
		return result.rowCount === 0;
	}
	/**
	 * Return null if user doesn't exist
	 */
	public async findByUserId(user_id: Id): Promise<Array<Subscribe> | null> {
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
}
