import {
	createUInt,
	Feed,
	Password,
	Podcast,
	Subscribe,
	User,
} from "../mod.ts";
import type {
	Id,
	IPodcastStream,
	ISearchStrategy,
	IStreamStrategy,
	ISubscribeManageRepository,
	ISubscribeRepository,
	IUserRepository,
	SearchPlatform,
	SearchService,
	UInt,
} from "../mod.ts";
import {
	anyNumber,
	anyOfClass,
	anyString,
	instance,
	mock,
	when,
} from "ts-mockito";

export class UserMother {
	public createUser(): User {
		const userId = createUInt(1);
		const userLogin = "test";
		const userPassword = new Password("test");
		return new User(userId, userLogin, userPassword);
	}
}

export class SubscribeMother {
	public createYoutubeSubscribe(): Subscribe {
		const subscribeId = createUInt(1);
		const subscribeTitle = "test";
		const subscribeUrl = new URL("https://www.youtube.com/@MrVrschool");
		const subscribePlatform = "youtube";
		return new Subscribe(
			subscribeId,
			subscribeUrl,
			subscribeTitle,
			subscribePlatform,
		);
	}
}

export class PodcastMother {
	public createYoutubePodcast(): Podcast {
		const url = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const platform = "youtube";
		const title = "test";
		const durationInSeconds = createUInt(10 * 60 + 3);
		const relevance = new Date("2019-11-23");
		return new Podcast(url, title, platform, durationInSeconds, relevance);
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

export class FeedMother {
	private readonly userMother: UserMother;

	constructor() {
		this.userMother = new UserMother();
	}

	public createFeed(): Feed {
		const user = this.userMother.createUser();
		return new Feed(user.id);
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

	public produceDefaultStream(): void {
		const defaultStream = new ReadableStream<Uint8Array<ArrayBuffer>>();
		this.produceGetStream(defaultStream);
		this.produceClose();
	}

	public createPodcastStream(): IPodcastStream {
		const podcastStream = instance(this.mockPodcastStream);
		return podcastStream;
	}
}

interface createYtdlpStreamStrategyParameters {
	_isSupportedUrl?: boolean;
	_canStreamPodcast?: boolean;
	_podcastStream?: IPodcastStream;
}

export class StreamStrategyMockMother {
	private readonly podcastStreamMother: PodcastStreamMockMother;

	constructor() {
		this.podcastStreamMother = new PodcastStreamMockMother();
	}

	public createYtdlpStreamStrategy(
		{ _isSupportedUrl, _canStreamPodcast, _podcastStream }:
			createYtdlpStreamStrategyParameters,
	): IStreamStrategy {
		const mockStreamStrategy = mock<IStreamStrategy>();
		let podcastStream = null;
		const strategyName = "ytdlp";
		const isSupportedURL = _isSupportedUrl ?? true;
		const canStreamPodcast = _canStreamPodcast ?? true;
		if (canStreamPodcast) {
			podcastStream = _podcastStream ??
				this.podcastStreamMother.createPodcastStream();
		}
		when(mockStreamStrategy.getStrategyName()).thenReturn(strategyName);
		when(mockStreamStrategy.isSupportedURL(anyOfClass(URL))).thenResolve(
			isSupportedURL,
		);
		when(mockStreamStrategy.streamPodcast(anyOfClass(URL))).thenReturn(
			podcastStream,
		);
		const streamStrategy = instance(mockStreamStrategy);
		return streamStrategy;
	}
}

interface createUserRepositoryParameters {
	canCreateUser?: boolean;
	_user?: User;
	canDeleteUser?: boolean;
	canFindUser?: boolean;
	canSaveUser?: boolean;
}

export class UserRepositoryMockMother {
	private readonly userMother: UserMother;

	constructor() {
		this.userMother = new UserMother();
	}

	public createUserRepository(
		{
			canCreateUser = true,
			_user,
			canDeleteUser = true,
			canFindUser = true,
			canSaveUser = true,
		}: createUserRepositoryParameters,
	): IUserRepository {
		const mockUserRepository = mock<IUserRepository>();
		let user: User | null = null;
		if (canCreateUser && canFindUser) {
			user = _user ?? this.userMother.createUser({});
		}
		when(mockUserRepository.create(anyString(), anyOfClass(Password)))
			.thenResolve(user);
		when(mockUserRepository.delete(anyOfClass(User))).thenResolve(
			canDeleteUser,
		);
		when(mockUserRepository.findById(anyNumber())).thenResolve(user);
		when(mockUserRepository.findByLogin(anyString())).thenResolve(user);
		when(mockUserRepository.save(anyOfClass(User))).thenResolve(
			canSaveUser,
		);
		const userRepository = instance(mockUserRepository);
		return userRepository;
	}
}

interface createSubscribeRepositoryParameters {
	canCreateSubscribe?: boolean;
	_subscribe?: Subscribe;
	canDeleteSubscribe?: boolean;
	canFindSubscribe?: boolean;
	canSaveSubscribe?: boolean;
}

export class SubscribeRepositoryMockMother {
	private readonly subscribeMother: SubscribeMother;

	constructor() {
		this.subscribeMother = new SubscribeMother();
	}

	public createSubscribeRepository(
		{
			canCreateSubscribe = true,
			_subscribe,
			canDeleteSubscribe = true,
			canFindSubscribe = true,
			canSaveSubscribe = true,
		}: createSubscribeRepositoryParameters,
	): ISubscribeRepository {
		const mockSubscribeRepository = mock<ISubscribeRepository>();
		let subscribe: Subscribe | null = null;
		if (canCreateSubscribe && canFindSubscribe) {
			subscribe = _subscribe ??
				this.subscribeMother.createYoutubeSubscribe({});
		}
		when(
			mockSubscribeRepository.create(
				anyOfClass(URL),
				anyString(),
				anyString(),
			),
		).thenResolve(subscribe);
		when(mockSubscribeRepository.delete(anyOfClass(Subscribe)))
			.thenResolve(canDeleteSubscribe);
		when(mockSubscribeRepository.findById(anyNumber())).thenResolve(
			subscribe,
		);
		when(mockSubscribeRepository.save(anyOfClass(Subscribe))).thenResolve(
			canSaveSubscribe,
		);
		const subscribeRepository = instance(mockSubscribeRepository);
		return subscribeRepository;
	}
}
