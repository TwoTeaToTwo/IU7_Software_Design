import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { SubscribeMother, UserMother } from "../object_mothers.ts";
import {
	databaseConfig,
	fixtures,
	type PostgresDB,
} from "@podcast/database_postgres";
import { createChannelService } from "./factory_methods.ts";

const subscribeMother = new SubscribeMother();
const userMother = new UserMother();

let connectionPool: Pool;
let db: PostgresDB;

Deno.test.beforeEach(() => {
	connectionPool = new Pool({
		connectionString: databaseConfig.testConnectionString,
	});
	db = drizzle(connectionPool);
});

Deno.test.afterEach(async () => {
	await fixtures.clearUsersHaveSubscriptionsTableFixture(db);
	await fixtures.clearSubscriptionsTableFixture(db);
	await fixtures.clearUserTableFixture(db);
	await connectionPool.end();
});

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	await fixtures.fillUserTableFixture(db);
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
