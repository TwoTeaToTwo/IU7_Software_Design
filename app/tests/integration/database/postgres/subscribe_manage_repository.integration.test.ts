import {
	databaseConfig,
	type PostgresDB,
	SubscribeManageRepository,
} from "@podcast/database_postgres";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	clearSubscriptionsTableFixture,
	clearUsersHaveSubscriptionsTableFixture,
	clearUserTableFixture,
	fillSubscriptionsTableFixture,
	fillUsersHaveSubscriptionsTableFixture,
	fillUserTableFixture,
	SubscribeMother,
	UserMother,
} from "@podcast/tests-utils";

const subscribeMother = new SubscribeMother();
const userMother = new UserMother();
let connectionPool: Pool;
let db: PostgresDB;

Deno.test.beforeEach(() => {
	connectionPool = new Pool({
		connectionString: databaseConfig.connectionString,
	});
	db = drizzle(connectionPool);
});

Deno.test.afterEach(async () => {
	await clearUsersHaveSubscriptionsTableFixture(db);
	await clearSubscriptionsTableFixture(db);
	await clearUserTableFixture(db);
	await connectionPool.end();
});

Deno.test("Database: SubscribeManageRepository: subscribe: user and source exists", async () => {
	await fillSubscriptionsTableFixture(db);
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.subscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, true);
});

Deno.test("Database: SubscribeManageRepository: subscribe: user and source doesn't exists", async () => {
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.subscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, false);
});

Deno.test("Database: SubscribeManageRepository: unsubscribe: user and source exists", async () => {
	await fillSubscriptionsTableFixture(db);
	await fillUserTableFixture(db);
	await fillUsersHaveSubscriptionsTableFixture(db);
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.unsubscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, true);
});

Deno.test("Database: SubscribeManageRepository: unsubscribe: user and source doesn't exists", async () => {
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.unsubscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, false);
});

Deno.test("Database: SubscribeManageRepository: findSubscribesByUserId: user and source exist", async () => {
	await fillSubscriptionsTableFixture(db);
	await fillUserTableFixture(db);
	await fillUsersHaveSubscriptionsTableFixture(db);
	const user = userMother.createUser();
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribes = [subscribe];
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.findSubscribesByUserId(
		user.id,
	);

	assertEquals(result, subscribes);
});

Deno.test("Database: SubscribeManageRepository: findSubscribesByUserId: user and source don't exist", async () => {
	const user = userMother.createUser();
	const subscribeManageRepository = new SubscribeManageRepository(db);

	const result = await subscribeManageRepository.findSubscribesByUserId(
		user.id,
	);

	assertEquals(result, null);
});
