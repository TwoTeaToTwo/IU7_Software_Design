import type { PostgresLiteDB } from "@podcast/database_postgres_lite";
import {
	subscriptions,
	users,
	usersHaveSubscriptions,
} from "@podcast/database_postgres_lite";
import { eq, max } from "drizzle-orm";
import type { Subscribe, User } from "@podcast/core";

export class UserHelper {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	public async getLastUserId(): Promise<number> {
		const result = await this.db.select({ value: max(users.id) }).from(
			users,
		);
		const record = result[0];
		if (record !== null && record.value !== null) {
			return record.value;
		} else {
			return 1;
		}
	}
}

export class SubscribeHelper {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	public async getLastSubscribeId(): Promise<number> {
		const result = await this.db.select({ value: max(subscriptions.id) })
			.from(
				subscriptions,
			);
		const record = result[0];
		if (record !== null && record.value !== null) {
			return record.value;
		} else {
			return 1;
		}
	}
}

export class SubscribeManageHelper {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	public async initSubscribe(
		user: User,
		subscribe: Subscribe,
	): Promise<void> {
		const userExists = await this.db.select().from(users).where(
			eq(users.id, user.id),
		);
		const subExists = await this.db.select().from(subscriptions).where(
			eq(subscriptions.id, subscribe.id),
		);
		if (userExists.length !== 0 && subExists.length !== 0) {
			await this.db.insert(usersHaveSubscriptions).values(
				{
					user_id: user.id,
					subscription_id: subscribe.id,
				},
			).onConflictDoNothing();
		}
	}
}
