import { Container } from "inversify";
import type {
	ISearchStrategy,
	IStreamStrategy,
	ISubscribeManageRepository,
	ISubscribeRepository,
	IUserRepository,
	SearchPlatform,
	StreamToolName,
} from "@podcast/core";
import {
	ChannelService,
	FeedService,
	INJECT_TYPES,
	SearchService,
	StreamService,
} from "@podcast/core";
import { InMemorySearchStrategy } from "@podcast/in_memory_search";
import { YTDLPStreamStrategy } from "@podcast/ytdlp";
import {
	SubscribeManageRepository,
	SubscribeRepository,
	UserRepository,
} from "@podcast/database_postgres";

function createSearchStrategies(): Map<SearchPlatform, ISearchStrategy> {
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const inMemorySearch = new InMemorySearchStrategy();
	search_strategies.set(inMemorySearch.getPlatform(), inMemorySearch);
	return search_strategies;
}

function createStreamStrategies(): Map<StreamToolName, IStreamStrategy> {
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const ytdlp_streamer = new YTDLPStreamStrategy();
	stream_strategies.set(ytdlp_streamer.getStrategyName(), ytdlp_streamer);
	return stream_strategies;
}

export const createDITestContainer = (): Container => {
	const container = new Container();
	const search_strategies = createSearchStrategies();
	const stream_strategies = createStreamStrategies();
	container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	container.bind<SearchService>(INJECT_TYPES.SearchService).to(SearchService);
	container.bind<StreamService>(INJECT_TYPES.StreamService).to(StreamService);

	container.bind<IUserRepository>(INJECT_TYPES.UserRepository).to(
		UserRepository,
	);
	container.bind<ISubscribeRepository>(INJECT_TYPES.SubscribeRepository).to(
		SubscribeRepository,
	);
	container.bind<ISubscribeManageRepository>(
		INJECT_TYPES.SubscribeManageRepository,
	).to(
		SubscribeManageRepository,
	);

	container.bind<ChannelService>(INJECT_TYPES.ChannelService).to(
		ChannelService,
	);
	container.bind<FeedService>(INJECT_TYPES.FeedService).to(FeedService);
	return container;
};
