import { Container } from "inversify";
import type {
	ISearchStrategy,
	IStreamStrategy,
	SearchPlatform,
	StreamToolName,
} from "@podcast/core";
import { INJECT_TYPES, SearchService } from "@podcast/core";
import { YoutubeSearchStrategy } from "@podcast/youtube_search";
import { YTDLPStreamStrategy } from "@podcast/ytdlp";

function createSearchStrategies(): Map<SearchPlatform, ISearchStrategy> {
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const youtube_search = new YoutubeSearchStrategy();
	search_strategies.set(youtube_search.getPlatform(), youtube_search);
	return search_strategies;
}

function createStreamStrategies(): Map<StreamToolName, IStreamStrategy> {
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const ytdlp_streamer = new YTDLPStreamStrategy();
	stream_strategies.set(ytdlp_streamer.getStrategyName(), ytdlp_streamer);
	return stream_strategies;
}

export function createDIContainer(): Container {
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
	// TODO other services
	return container;
}
