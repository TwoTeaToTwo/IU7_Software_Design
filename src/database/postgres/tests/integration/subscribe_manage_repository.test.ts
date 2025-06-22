import {
	INJECT_TYPES,
	type PostgresDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres";
import { subscriptions, users } from "../../schema.ts";
import { createUInt, Password, Subscribe } from "@podcast/domain";
import { Container } from "inversify";
import { assertEquals } from "jsr:@std/assert";
import { max } from "npm:drizzle-orm";
import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";
import { assert } from "node:console";

async function getLastUserId(db: PostgresDB): Promise<number> {
	const result = await db.select({ value: max(users.id) }).from(
		users,
	);
	const record = result[0];
	if (record !== null && record.value !== null) {
		return record.value;
	} else {
		return 1;
	}
}

async function getLastSubscribeId(db: PostgresDB): Promise<number> {
	const result = await db.select({ value: max(subscriptions.id) }).from(
		subscriptions,
	);
	const record = result[0];
	if (record !== null && record.value !== null) {
		return record.value;
	} else {
		return 1;
	}
}

Deno.test("Database: SubscribeMangeRepository: subscribe: user and source exists", async () => {
	// initialization
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(
		UserRepository,
	);
	test_container.bind(INJECT_TYPES.SubscribeManageRepository).to(
		SubscribeManageRepository,
	);
	const subscriptions = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const users = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const manage = test_container.get<SubscribeManageRepository>(
		INJECT_TYPES.SubscribeManageRepository,
	);
	// fill subscribes
	const url = new URL("https://www.youtube.com/@IzzyLaif");
	const title = "IzzyLaif";
	const platform = "youtube";
	const subscribe = await subscriptions.create(url, title, platform);
	// fill users
	const login = "test";
	const password = new Password("test");
	const user = await users.create(login, password);
	// testing
	let result = false;
	if (user && subscribe) {
		result = await manage.subscribe(user.id, subscribe.id);
		// clearing
		await users.delete(user);
		await subscriptions.delete(subscribe);
	} else {
		assert(
			false,
			"clear database before testing, or create temporary database",
		);
	}
	await pool.end();
	assertEquals(result, true);
});

Deno.test("Database: SubscribeMangeRepository: subscribe: user and source doesn't exists", async () => {
	// initialization
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeManageRepository).to(
		SubscribeManageRepository,
	);
	const manage = test_container.get<SubscribeManageRepository>(
		INJECT_TYPES.SubscribeManageRepository,
	);
	// testing
	const result = await manage.subscribe(
		createUInt(await getLastUserId(db) + 1),
		createUInt(await getLastSubscribeId(db) + 1),
	);
	//clearing
	await pool.end();
	assertEquals(result, false);
});

// TODO add subscribe user function
// Deno.test("Database: SubscribeRepository: save: subscribe exists", async () => {
// 	const test_container = new Container();
// 	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
// 	const db = drizzle(pool);
// 	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
// 		db,
// 	);
// 	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
// 		SubscribeRepository,
// 	);
// 	const subscribe_repo = test_container.get<SubscribeRepository>(
// 		INJECT_TYPES.SubscribeRepository,
// 	);
// 	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
// 	const user_repo = test_container.get<UserRepository>(
// 		INJECT_TYPES.UserRepository,
// 	);
// 	const login = "test";
// 	const password = new Password("test");
// 	const user = await user_repo.create(login, password);
// 	const url = new URL("https://www.youtube.com/@izzylie");
// 	const title = "IzzyLaif eng";
// 	const platform = "youtube";
// 	const result = await subscribe_repo.findByUserId(user!.id);
// 	const subscribe = new Subscribe(
// 		createUInt(await getLastSubscribeId(db)),
// 		url,
// 		title,
// 		platform,
// 	);
// 	let assert: boolean;
// 	if (result === null) {
// 		assert = false;
// 	} else {
// 		assert = (result.length === 0) && (result[0] === subscribe);
// 	}
// 	await pool.end();
// 	assertEquals(assert, true);
// });
