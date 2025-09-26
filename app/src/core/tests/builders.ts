import { Password, Subscribe, User } from "../mod.ts";
import type {
	IPodcastStream,
	ISearchStrategy,
	IStreamStrategy,
	ISubscribeManageRepository,
	ISubscribeRepository,
	IUserRepository,
	Podcast,
	SearchPlatform,
	SearchService,
	StreamToolName,
} from "../mod.ts";
import {
	anyNumber,
	anyOfClass,
	anyString,
	instance,
	mock,
	when,
} from "ts-mockito";

export class UserRepositoryMockBuilder {
	private readonly mockUserRepository;

	constructor() {
		this.mockUserRepository = mock<IUserRepository>();
	}

	public produceCreate(user: User | null): void {
		when(this.mockUserRepository.create(anyString(), anyOfClass(Password)))
			.thenResolve(user);
	}

	public produceDelete(success: boolean): void {
		when(this.mockUserRepository.delete(anyOfClass(User))).thenResolve(
			success,
		);
	}

	public produceFindById(user: User | null): void {
		when(this.mockUserRepository.findById(anyNumber())).thenResolve(
			user,
		);
	}

	public produceFindByLogin(user: User | null): void {
		when(this.mockUserRepository.findByLogin(anyString())).thenResolve(
			user,
		);
	}

	public produceSave(success: boolean): void {
		when(this.mockUserRepository.save(anyOfClass(User))).thenResolve(
			success,
		);
	}

	public createUserRepository(): IUserRepository {
		const userRepository = instance(this.mockUserRepository);
		return userRepository;
	}
}

export class SubscribeRepositoryMockBuilder {
	private readonly mockSubscribeRepository;

	constructor() {
		this.mockSubscribeRepository = mock<ISubscribeRepository>();
	}

	public produceCreate(subscribe: Subscribe | null): void {
		when(
			this.mockSubscribeRepository.create(
				anyOfClass(URL),
				anyString(),
				anyString(),
			),
		)
			.thenResolve(subscribe);
	}

	public produceDelete(success: boolean): void {
		when(this.mockSubscribeRepository.delete(anyOfClass(Subscribe)))
			.thenResolve(success);
	}

	public produceFindById(subscribe: Subscribe | null): void {
		when(this.mockSubscribeRepository.findById(anyNumber())).thenResolve(
			subscribe,
		);
	}

	public produceSave(success: boolean): void {
		when(this.mockSubscribeRepository.save(anyOfClass(Subscribe)))
			.thenResolve(success);
	}

	public createSubscribeRepository(): ISubscribeRepository {
		const subscribeRepository = instance(this.mockSubscribeRepository);
		return subscribeRepository;
	}
}

export class StreamStrategyMockBuilder {
	private readonly mockStreamStrategy;

	constructor() {
		this.mockStreamStrategy = mock<IStreamStrategy>();
	}

	public produceGetStrategyName(strategyName: StreamToolName): void {
		when(this.mockStreamStrategy.getStrategyName()).thenReturn(
			strategyName,
		);
	}

	public produceIsSupportedURL(isSupported: boolean): void {
		when(this.mockStreamStrategy.isSupportedURL(anyOfClass(URL)))
			.thenResolve(isSupported);
	}

	public produceStreamPodcast(
		podcastStream: IPodcastStream | null,
	): void {
		when(this.mockStreamStrategy.streamPodcast(anyOfClass(URL))).thenReturn(
			podcastStream,
		);
	}

	public createStreamStrategy(): IStreamStrategy {
		const streamStrategy = instance(this.mockStreamStrategy);
		return streamStrategy;
	}
}

export class PodcastStreamMockBuilder {
	private readonly mockPodcastStream;

	constructor() {
		this.mockPodcastStream = mock<IPodcastStream>();
	}

	public produceGetStream(
		stream: ReadableStream<Uint8Array<ArrayBuffer>> = new ReadableStream(),
	): void {
		when(this.mockPodcastStream.getStream()).thenReturn(stream);
	}

	public produceClose(): void {
		when(this.mockPodcastStream.close()).thenReturn();
	}

	public createPodcastStream(): IPodcastStream {
		const podcastStream = instance(this.mockPodcastStream);
		return podcastStream;
	}
}

export class SubscribeManageRepositoryMockBuilder {
	private readonly mockSubscribeManageRepository: ISubscribeManageRepository;

	constructor() {
		this.mockSubscribeManageRepository = mock<ISubscribeManageRepository>();
	}

	public produceFindSubscribesByUserId(subscribes: Subscribe[] | null): void {
		when(
			this.mockSubscribeManageRepository.findSubscribesByUserId(
				anyNumber(),
			),
		).thenResolve(subscribes);
	}

	public produceSubscribe(success: boolean): void {
		when(
			this.mockSubscribeManageRepository.subscribe(
				anyNumber(),
				anyNumber(),
			),
		).thenResolve(success);
	}

	public produceUnsubscribe(success: boolean): void {
		when(
			this.mockSubscribeManageRepository.unsubscribe(
				anyNumber(),
				anyNumber(),
			),
		).thenResolve(success);
	}

	public createSubscribeManageRepository(): ISubscribeManageRepository {
		const subscribeManageRepository = instance(
			this.mockSubscribeManageRepository,
		);
		return subscribeManageRepository;
	}
}

export class SearchStrategyMockBuilder {
	private readonly mockSearchStrategy;

	constructor() {
		this.mockSearchStrategy = mock<ISearchStrategy>();
	}

	public produceSearchPodcast(podcasts: Podcast[]): void {
		when(this.mockSearchStrategy.searchPodcast(anyString(), anyNumber()))
			.thenResolve(podcasts);
	}

	public produceSearchByURL(podcast: Podcast): void {
		when(this.mockSearchStrategy.searchByURL(anyOfClass(URL))).thenResolve(
			podcast,
		);
	}

	public produceIsCorrectURL(isCorrectUrl: boolean): void {
		when(this.mockSearchStrategy.isCorrectURL(anyOfClass(URL))).thenReturn(
			isCorrectUrl,
		);
	}

	public produceIsChannelExist(isChannelExist: boolean): void {
		when(this.mockSearchStrategy.isChannelExist(anyOfClass(URL)))
			.thenResolve(
				isChannelExist,
			);
	}

	public produceGetPlatform(searchPlatform: SearchPlatform): void {
		when(this.mockSearchStrategy.getPlatform()).thenReturn(searchPlatform);
	}

	public produceGetLastPodcastsByChannel(podcasts: Podcast[] | null): void {
		when(
			this.mockSearchStrategy.getLastPodcastsByChannel(
				anyOfClass(URL),
				anyNumber(),
			),
		).thenResolve(podcasts);
	}

	public createSearchStrategy(): ISearchStrategy {
		const SearchStrategy = instance(this.mockSearchStrategy);
		return SearchStrategy;
	}
}

export class SearchServiceMockBuilder {
	private readonly mockSearch;

	constructor() {
		this.mockSearch = mock<SearchService>();
	}

	public produceIsChannelExist(): void {
		when(this.mockSearch.isChannelExist(anyOfClass(URL))).thenResolve(
			true,
		);
	}

	public produceGetPlatformByURL(searchPlatform: SearchPlatform): void {
		when(this.mockSearch.getPlatformByURL(anyOfClass(URL))).thenReturn(
			searchPlatform,
		);
	}

	public produceSearchPodcast(podcasts: Podcast[]): void {
		when(
			this.mockSearch.searchPodcast(
				anyString(),
				anyNumber(),
			),
		).thenResolve(podcasts);
	}

	public produceSearchByURL(podcast: Podcast): void {
		when(this.mockSearch.searchByURL(anyOfClass(URL))).thenResolve(
			podcast,
		);
	}

	public produceGetLastPodcastsByChannel(podcasts: Podcast[]): void {
		when(
			this.mockSearch.getLastPodcastsByChannel(
				anyOfClass(URL),
				anyNumber(),
			),
		)
			.thenResolve(podcasts);
	}

	public createSearchService(): SearchService {
		const searcher = instance(this.mockSearch);
		return searcher;
	}
}
