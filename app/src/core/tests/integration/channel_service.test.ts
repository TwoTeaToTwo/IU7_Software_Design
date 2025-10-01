import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ChannelService, SearchService } from "../../mod.ts";
import type { ISearchStrategy, SearchPlatform } from "../../mod.ts";
import { SubscribeMother, UserMother } from "../object_mothers.ts";
import {
	databaseConfig,
	fixtures,
	type PostgresDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres";
import { InMemorySearchStrategy } from "@podcast/in_memory_search";

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
	const subscribeManageRepository = new SubscribeManageRepository(db);
	const subscribeRepository = new SubscribeRepository(db);
	const userRepository = new UserRepository(db);
	const inMemorySearchStrategy: ISearchStrategy =
		new InMemorySearchStrategy();
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(
		inMemorySearchStrategy.getPlatform(),
		inMemorySearchStrategy,
	);
	const searchService = new SearchService(searchStrategies);
	const channelService = new ChannelService(
		searchService,
		subscribeManageRepository,
		userRepository,
		subscribeRepository,
	);

	const result = await channelService.subscribe(
		user.id,
		subscribe.url,
		subscribe.title,
	);

	assertEquals(result, true);
});
