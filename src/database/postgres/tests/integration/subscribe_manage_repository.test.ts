import {
	INJECT_TYPES,
	type PostgresDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres";
import { subscriptions, users } from "../../schema.ts";
import { createUInt, Password, type Subscribe } from "@podcast/domain";
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

Deno.test("Database: SubscribeMangeRepository: unsubscribe: user and source exists", async () => {
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
	// subscribe
	let result = false;
	if (user && subscribe) {
		const is_subscribed = await manage.subscribe(user.id, subscribe.id);
		// testing
		if (is_subscribed) {
			result = await manage.unsubscribe(user.id, subscribe.id);
		}
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

Deno.test("Database: SubscribeMangeRepository: unsubscribe: user and source doesn't exists", async () => {
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
	const result = await manage.unsubscribe(
		createUInt(await getLastUserId(db) + 1),
		createUInt(await getLastSubscribeId(db) + 1),
	);
	//clearing
	await pool.end();
	assertEquals(result, false);
});

Deno.test("Database: SubscribeMangeRepository: findSubscribesByUserId: user and source exist", async () => {
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
	// subscribe
	let result: Array<Subscribe> | null = null;
	if (user && subscribe) {
		const is_subscribed = await manage.subscribe(user.id, subscribe.id);
		// testing
		if (is_subscribed) {
			result = await manage.findSubscribesByUserId(user.id);
		}
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
	assertEquals(result, new Array(subscribe));
});

Deno.test("Database: SubscribeMangeRepository: findSubscribesByUserId: user and source don't exist", async () => {
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
	const result = await manage.findSubscribesByUserId(
		createUInt(await getLastUserId(db) + 1),
	);
	await pool.end();
	assertEquals(result, null);
});
