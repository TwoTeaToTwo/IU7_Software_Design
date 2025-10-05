import {
	databaseConfig,
	type PostgresDB,
	SubscribeRepository,
} from "@podcast/database_postgres";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	clearSubscriptionsTableFixture,
	fillSubscriptionsTableFixture,
	SubscribeMother,
} from "@podcast/tests-utils";

const subscribeMother = new SubscribeMother();
let connectionPool: Pool;
let db: PostgresDB;

Deno.test.beforeEach(() => {
	connectionPool = new Pool({
		connectionString: databaseConfig.testConnectionString,
	});
	db = drizzle(connectionPool);
});

Deno.test.afterEach(async () => {
	await clearSubscriptionsTableFixture(db);
	await connectionPool.end();
});

Deno.test("Database: SubscribeRepository: create: add new subscribe", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.create(
		subscribe.url,
		subscribe.title,
		subscribe.platform,
	);

	assertEquals(result, subscribe);
});

Deno.test("Database: SubscribeRepository: create: add existing subscribe", async () => {
	await fillSubscriptionsTableFixture(db);
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.create(
		subscribe.url,
		subscribe.title,
		subscribe.platform,
	);

	assertEquals(result, null);
});

Deno.test("Database: SubscribeRepository: findById: subscribe exists", async () => {
	await fillSubscriptionsTableFixture(db);
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.findById(subscribe.id);

	assertEquals(result, subscribe);
});

Deno.test("Database: SubscribeRepository: findById: subscribe doesn't exist", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.findById(subscribe.id);

	assertEquals(result, null);
});

Deno.test("Database: SubscribeRepository: save: subscribe exists", async () => {
	await fillSubscriptionsTableFixture(db);
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.save(subscribe);

	assertEquals(result, true);
});

Deno.test("Database: SubscribeRepository: save: subscribe doesn't exist", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.save(subscribe);

	assertEquals(result, false);
});

Deno.test("Database: SubscribeRepository: delete: subscribe exists", async () => {
	await fillSubscriptionsTableFixture(db);
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.delete(subscribe);

	assertEquals(result, true);
});

Deno.test("Database: SubscribeRepository: delete: subscribe doesn't exist", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.delete(subscribe);

	assertEquals(result, false);
});
