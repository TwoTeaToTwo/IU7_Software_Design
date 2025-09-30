import { createUInt, Subscribe } from "@podcast/core";
import type { Id, ISubscribeRepository, SearchPlatform } from "@podcast/core";
import type { PostgresLiteDB } from "../database.ts";
import { inject, injectable } from "inversify";
import { INJECT_TYPES } from "../types.ts";
import { subscriptions } from "../schema.ts";
import { eq } from "drizzle-orm";

@injectable()
export class SubscribeRepository implements ISubscribeRepository {
	constructor(
		@inject(INJECT_TYPES.NodePgDatabase) private _db: PostgresLiteDB,
	) {}
	/**
	 * Return true on success
	 */
	public async delete(subscribe: Subscribe): Promise<boolean> {
		const result = await this._db.delete(subscriptions).where(
			eq(subscriptions.id, subscribe.id),
		);
		return result.affectedRows !== 0;
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
		const result = await this._db.update(subscriptions).set({
			url: subscribe.url.toString(),
			title: subscribe.title,
			platform: subscribe.platform,
		}).where(eq(subscriptions.id, subscribe.id));
		return result.affectedRows !== 0;
	}
	/**
	 * Return Subscribe on success, else null
	 */
	public async create(
		url: URL,
		title: string,
		platform: SearchPlatform,
	): Promise<Subscribe | null> {
		let subscribe: Subscribe | null;
		const result = await this._db.insert(subscriptions).values({
			title: title,
			url: url.toString(),
			platform: platform,
		}).onConflictDoNothing().returning();
		if (result.length === 0) {
			subscribe = null;
		} else {
			const record = result[0];
			subscribe = new Subscribe(
				createUInt(record.id),
				new URL(record.url),
				record.title,
				record.platform,
			);
		}
		return subscribe;
	}
}
