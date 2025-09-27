import {
	type PostgresLiteDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres_lite";
import { SubscribeMother, UserMother } from "@podcast/core";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/pglite";
import { MigrationHelper, SubscribeManageHelper } from "../helpers.ts";

const subscribeMother = new SubscribeMother();
const userMother = new UserMother();
let db: PostgresLiteDB;
let subscribeManageHelper: SubscribeManageHelper;

Deno.test.beforeAll(async () => {
	db = drizzle();
	const migrationHelper = new MigrationHelper(db);
	subscribeManageHelper = new SubscribeManageHelper(db);
	await migrationHelper.setupTestDb();
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeRepository = new SubscribeRepository(db);
	const userRepository = new UserRepository(db);
	await subscribeRepository.create(
		subscribe.url,
		subscribe.title,
		subscribe.platform,
	);
	await userRepository.create(user.login, user.password);
});

Deno.test("Database: SubscribeMangeRepository: subscribe: user and source exists", async () => {
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.subscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, true);
});

Deno.test("Database: SubscribeMangeRepository: unsubscribe: user and source exists", async () => {
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	await subscribeManageHelper.initSubscribe(user, subscribe);
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.unsubscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, true);
});

// Deno.test("Database: SubscribeMangeRepository: subscribe: user and source doesn't exists", async () => {
// 	const wrongSubscribeId = await subscribeHelper.getLastSubscribeId() + 1;
// 	const wrongUserId = await userHelper.getLastUserId() + 1;
// 	const subscribe = subscribeMother.createYoutubeSubscribe({
// 		id: createUInt(wrongSubscribeId),
// 	});
// 	const user = userMother.createUser({ id: createUInt(wrongUserId) });
// 	const subscribeManageRepository = new SubscribeManageRepository(db);

// 	const result = await subscribeManageRepository.subscribe(
// 		user.id,
// 		subscribe.id,
// 	);

// 	assertEquals(result, false);
// });

// Deno.test("Database: SubscribeMangeRepository: findSubscribesByUserId: user and source don't exist", async () => {
// 	const wrongUserId = await userHelper.getLastUserId() + 1;
// 	const user = userMother.createUser({ id: createUInt(wrongUserId) });
// 	const subscribeManageRepository = new SubscribeManageRepository(db);

// 	const result = await subscribeManageRepository.findSubscribesByUserId(
// 		user.id,
// 	);

// 	assertEquals(result, null);
// });

// Deno.test("Database: SubscribeMangeRepository: unsubscribe: user and source doesn't exists", async () => {
// 	const wrongSubscribeId = await subscribeHelper.getLastSubscribeId() + 1;
// 	const wrongUserId = await userHelper.getLastUserId() + 1;
// 	const subscribe = subscribeMother.createYoutubeSubscribe({
// 		id: createUInt(wrongSubscribeId),
// 	});
// 	const user = userMother.createUser({ id: createUInt(wrongUserId) });
// 	const subscribeManageRepository = new SubscribeManageRepository(db);

// 	const result = await subscribeManageRepository.unsubscribe(
// 		user.id,
// 		subscribe.id,
// 	);

// 	assertEquals(result, false);
// });
