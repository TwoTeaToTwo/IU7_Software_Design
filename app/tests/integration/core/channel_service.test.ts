import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	clearSubscriptionsTableFixture,
	clearUsersHaveSubscriptionsTableFixture,
	clearUserTableFixture,
	fillUserTableFixture,
	SubscribeMother,
	UserMother,
} from "@podcast/tests-utils";
import { databaseConfig, type PostgresDB } from "@podcast/database_postgres";
import { createChannelService } from "./factory_methods.ts";

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

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	await fillUserTableFixture(db);
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const user = userMother.createUser();
	const channelService = createChannelService(db);

	const result = await channelService.subscribe(
		user.id,
		subscribe.url,
		subscribe.title,
	);

	assertEquals(result, true);
});
