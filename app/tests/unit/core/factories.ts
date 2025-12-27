import { ChannelService, SearchService } from "@podcast/core";
import type { ISearchStrategy, SearchPlatform } from "@podcast/core";
import {
	createPostgresLiteDB,
	type PostgresLiteDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres_lite";
import { InMemorySearchStrategy } from "@podcast/in_memory_search";
import { DatabaseFixture } from "./fixtures.ts";

export class ChannelServiceFactory {
	private readonly dbFixture: DatabaseFixture;
	private readonly db: PostgresLiteDB;

	constructor() {
		this.db = createPostgresLiteDB();
		this.dbFixture = new DatabaseFixture(this.db);
	}

	public async createChannelService(): Promise<ChannelService> {
		await this.dbFixture.setupTestDb();
		const subscribeManageRepository = new SubscribeManageRepository(
			this.db,
		);
		const subscribeRepository = new SubscribeRepository(this.db);
		const userRepository = new UserRepository(this.db);
		const searchStrategy = new InMemorySearchStrategy();
		const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
		searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
		const searchService = new SearchService(searchStrategies);
		const channelService = new ChannelService(
			searchService,
			subscribeManageRepository,
			userRepository,
			subscribeRepository,
		);
		return channelService;
	}
}
