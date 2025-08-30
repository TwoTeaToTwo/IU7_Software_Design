import {
	INJECT_TYPES,
	type PostgresDB,
	SubscribeRepository,
} from "@podcast/database_postgres";
import { subscriptions } from "../../schema.ts";
import { createUInt, Subscribe } from "@podcast/core";
import { Container } from "inversify";
import { assertEquals } from "jsr:@std/assert";
import { max } from "npm:drizzle-orm";
import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";

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

Deno.test("Database: SubscribeRepository: create: add new subscribe", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@IzzyLaif");
	const title = "IzzyLaif";
	const platform = "youtube";
	const result = await repo.create(url, title, platform);
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db)),
		url,
		title,
		platform,
	);
	await pool.end();
	assertEquals(result, subscribe);
});

Deno.test("Database: SubscribeRepository: create: add existing subscribe", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@IzzyLaif");
	const title = "IzzyLaif";
	const platform = "youtube";
	const result = await repo.create(url, title, platform);
	await pool.end();
	assertEquals(result, null);
});

Deno.test("Database: SubscribeRepository: findById: subscribe exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@IzzyLaif");
	const title = "IzzyLaif";
	const platform = "youtube";
	const result = await repo.findById(
		await createUInt(await getLastSubscribeId(db)),
	);
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db)),
		url,
		title,
		platform,
	);
	await pool.end();
	assertEquals(result, subscribe);
});

Deno.test("Database: SubscribeRepository: findById: subscribe doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const result = await repo.findById(
		await createUInt(await getLastSubscribeId(db) + 1),
	);
	await pool.end();
	assertEquals(result, null);
});

Deno.test("Database: SubscribeRepository: save: subscribe exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@izzylie");
	const title = "IzzyLaif eng";
	const platform = "youtube";
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db)),
		url,
		title,
		platform,
	);
	const result = await repo.save(subscribe);
	await pool.end();
	assertEquals(result, true);
});

Deno.test("Database: SubscribeRepository: save: subscribe doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@izzylie");
	const title = "IzzyLaif eng";
	const platform = "youtube";
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db) + 1),
		url,
		title,
		platform,
	);
	const result = await repo.save(subscribe);
	await pool.end();
	assertEquals(result, false);
});

Deno.test("Database: SubscribeRepository: delete: subscribe exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@izzylie");
	const title = "IzzyLaif eng";
	const platform = "youtube";
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db)),
		url,
		title,
		platform,
	);
	const result = await repo.delete(subscribe);
	await pool.end();
	assertEquals(result, true);
});

Deno.test("Database: SubscribeRepository: delete: subscribe doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	const repo = test_container.get<SubscribeRepository>(
		INJECT_TYPES.SubscribeRepository,
	);
	const url = new URL("https://www.youtube.com/@izzylie");
	const title = "IzzyLaif eng";
	const platform = "youtube";
	const subscribe = new Subscribe(
		createUInt(await getLastSubscribeId(db)),
		url,
		title,
		platform,
	);
	const result = await repo.delete(subscribe);
	await pool.end();
	assertEquals(result, false);
});
