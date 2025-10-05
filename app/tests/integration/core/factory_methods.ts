import { ChannelService, SearchService } from "../../../src/core/mod.ts";
import type { ISearchStrategy, SearchPlatform } from "../../../src/core/mod.ts";
import {
	type PostgresDB,
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres";
import { InMemorySearchStrategy } from "@podcast/in_memory_search";

export const createChannelService = (db: PostgresDB): ChannelService => {
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
	return channelService;
};
