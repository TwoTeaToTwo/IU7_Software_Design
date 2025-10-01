import type { PostgresDB } from "../mod.ts";
import { subscriptions, users } from "../schema.ts";
import { sql } from "drizzle-orm";
import { SubscribeMother, UserMother } from "@podcast/core";

export const clearUserTableFixture = async (db: PostgresDB): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${sql.raw("users")} RESTART IDENTITY CASCADE`,
	);
};

export const fillUserTableFixture = async (db: PostgresDB): Promise<void> => {
	const userMother = new UserMother();
	const user = userMother.createUser();
	await db.insert(users).values({
		id: user.id,
		login: user.login,
		password: user.password.password,
	});
};

export const clearSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${
			sql.raw("subscriptions")
		} RESTART IDENTITY CASCADE`,
	);
};

export const fillSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	const subscribeMother = new SubscribeMother();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	await db.insert(subscriptions).values({
		id: subscribe.id,
		url: subscribe.url.toString(),
		title: subscribe.title,
		platform: subscribe.platform,
	});
};
