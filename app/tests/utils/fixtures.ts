import type { PostgresDB } from "@podcast/database_postgres";
import {
	subscriptions,
	users,
	usersHaveSubscriptions,
} from "@podcast/database_postgres";
import { sql } from "drizzle-orm";
import { SubscribeMother, UserMother } from "@podcast/tests-utils";

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

export const clearUsersHaveSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${
			sql.raw("user_have_subscriptions")
		} RESTART IDENTITY CASCADE`,
	);
};

export const fillUsersHaveSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	const subscribeMother = new SubscribeMother();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const userMother = new UserMother();
	const user = userMother.createUser();
	await db.insert(usersHaveSubscriptions).values({
		user_id: user.id,
		subscription_id: subscribe.id,
	});
};
