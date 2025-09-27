import {
	type PostgresLiteDB,
	SubscribeRepository,
} from "@podcast/database_postgres_lite";
import { SubscribeMother } from "@podcast/core";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/pglite";
import { MigrationHelper } from "../helpers.ts";

const subscribeMother = new SubscribeMother();
let db: PostgresLiteDB;

Deno.test.beforeAll(async () => {
	db = drizzle();
	const migrationHelper = new MigrationHelper(db);
	await migrationHelper.setupTestDb();
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

Deno.test("Database: SubscribeRepository: save: subscribe exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);

	const result = await subscribeRepository.save(subscribe);

	assertEquals(result, true);
});

// Deno.test("Database: SubscribeRepository: findById: subscribe exists", async () => {
// 	const subscribe = subscribeMother.createYoutubeSubscribe({});
// 	const subscribeRepository = new SubscribeRepository(db);

// 	const result = await subscribeRepository.findById(subscribe.id);

// 	assertEquals(result, subscribe);
// });

// Deno.test("Database: SubscribeRepository: findById: subscribe doesn't exist", async () => {
// 	const wrongId = await subscribeHelper.getLastSubscribeId() + 1;
// 	const subscribe = subscribeMother.createYoutubeSubscribe({
// 		id: createUInt(wrongId),
// 	});
// 	const subscribeRepository = new SubscribeRepository(db);

// 	const result = await subscribeRepository.findById(subscribe.id);

// 	assertEquals(result, null);
// });

// Deno.test("Database: SubscribeRepository: save: subscribe doesn't exist", async () => {
// 	const wrongId = await subscribeHelper.getLastSubscribeId() + 1;
// 	const subscribe = subscribeMother.createYoutubeSubscribe({
// 		id: createUInt(wrongId),
// 	});
// 	const subscribeRepository = new SubscribeRepository(db);

// 	const result = await subscribeRepository.save(subscribe);

// 	assertEquals(result, false);
// });

// Deno.test("Database: SubscribeRepository: delete: subscribe exists", async () => {
// 	const subscribe = subscribeMother.createYoutubeSubscribe({ title: "new" });
// 	const subscribeRepository = new SubscribeRepository(db);

// 	const result = await subscribeRepository.delete(subscribe);

// 	assertEquals(result, true);
// });

// Deno.test("Database: SubscribeRepository: delete: subscribe doesn't exist", async () => {
// 	const wrongId = await subscribeHelper.getLastSubscribeId() + 1;
// 	const subscribe = subscribeMother.createYoutubeSubscribe({
// 		id: createUInt(wrongId),
// 	});
// 	const subscribeRepository = new SubscribeRepository(db);

// 	const result = await subscribeRepository.delete(subscribe);

// 	assertEquals(result, false);
// });
