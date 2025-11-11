import type { PostgresDB } from "@podcast/database_postgres";
import { createUInt, Password, Subscribe, User } from "@podcast/core";
import {
	databaseConfig,
	subscriptions,
	users,
	usersHaveSubscriptions,
} from "@podcast/database_postgres";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { SubscribeMother } from "@podcast/tests-utils";

const subscribeMother = new SubscribeMother();
const subscribe = subscribeMother.createYoutubeSubscribe();
const subscribeUrl = subscribe.url;
const subscribePlatform = subscribe.platform;
const userCount = 1000;
const subscribesCount = 1000;
const password = new Password("1234");
const connectionPool: Pool = new Pool({
	connectionString: databaseConfig.connectionString,
});
const db: PostgresDB = drizzle(connectionPool);

const clearUserTableFixture = async (db: PostgresDB): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${sql.raw("users")} RESTART IDENTITY CASCADE`,
	);
};

const createUser = (login: number): User => {
	return new User(createUInt(login), login.toString(), password);
};

const fillUserTableFixture = async (db: PostgresDB): Promise<void> => {
	for (let i = 0; i < userCount; i++) {
		const user = createUser(i);
		await db.insert(users).values({
			id: user.id,
			login: user.login,
			password: user.password.password,
		});
	}
};

const clearSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${
			sql.raw("subscriptions")
		} RESTART IDENTITY CASCADE`,
	);
};

const createSubscribe = (id: number): Subscribe => {
	return new Subscribe(
		createUInt(id),
		subscribeUrl,
		id.toString(),
		subscribePlatform,
	);
};

const fillSubscriptionsTableFixture = async (
	db: PostgresDB,
): Promise<void> => {
	for (let i = 0; i < subscribesCount; i++) {
		const subscribe = createSubscribe(i);
		await db.insert(subscriptions).values({
			id: subscribe.id,
			url: subscribe.url.toString(),
			title: subscribe.title,
			platform: subscribe.platform,
		});
	}
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
	for (let i = 0; i < subscribesCount; i++) {
		const subscribe = createSubscribe(i);
		const user = createUser(i);
		await db.insert(usersHaveSubscriptions).values({
			user_id: user.id,
			subscription_id: subscribe.id,
		});
	}
};

const main = async (): Promise<void> => {
	await clearUserTableFixture(db);
	await clearSubscriptionsTableFixture(db);
	await clearUsersHaveSubscriptionsTableFixture(db);
	await fillUserTableFixture(db);
	await fillSubscriptionsTableFixture(db);
	await fillUsersHaveSubscriptionsTableFixture(db);
};

main();
