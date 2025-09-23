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

interface createUserParameters {
	id?: Id;
	login?: string;
	password?: Password;
}

export class UserMother {
	public createUser({ id, login, password }: createUserParameters): User {
		const userId = id ?? createUInt(1);
		const userLogin = login ?? "test";
		const userPassword = password ?? new Password("test");
		return new User(userId, userLogin, userPassword);
	}
}

interface createSubscribeParameters {
	platform: SearchPlatform;
	url: URL;
	id?: Id;
	title?: string;
}

interface createYoutubeSubscribeParameters {
	url?: URL;
	id?: Id;
	title?: string;
}

export class SubscribeMother {
	public createSubscribe(
		{ platform, url, id, title }: createSubscribeParameters,
	): Subscribe {
		const subscribeId = id ?? createUInt(1);
		const subscribeTitle = title ?? "test";
		return new Subscribe(
			subscribeId,
			url,
			subscribeTitle,
			platform,
		);
	}

	public createYoutubeSubscribe(
		{ url, id, title }: createYoutubeSubscribeParameters,
	): Subscribe {
		const subscribeUrl = url ??
			new URL("https://www.youtube.com/@MrVrschool");
		const subscribePlatform = "youtube";
		return this.createSubscribe({
			platform: subscribePlatform,
			url: subscribeUrl,
			id,
			title,
		});
	}
}

interface createPodcastParameters {
	url: URL;
	platform: SearchPlatform;
	title?: string;
	durationInSeconds?: UInt;
	relevance?: Date;
}

interface createYoutubePodcastParameters {
	title?: string;
	durationInSeconds?: UInt;
	relevance?: Date;
}

export class PodcastFabric {
	public createPodcast(
		{ url, platform, title, durationInSeconds, relevance }:
			createPodcastParameters,
	): Podcast {
		const podcastTitle = title ?? "test";
		const podcastDurationInSeconds = durationInSeconds ??
			createUInt(10 * 60 + 3);
		const podcastRelevance = relevance ?? new Date("2019-11-23");
		return new Podcast(
			url,
			podcastTitle,
			platform,
			podcastDurationInSeconds,
			podcastRelevance,
		);
	}

	public createYoutubePodcast(
		{ title, durationInSeconds, relevance }: createYoutubePodcastParameters,
	): Podcast {
		const podcastUrl = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const podcastPlatform = "youtube";
		return this.createPodcast(
			{
				url: podcastUrl,
				platform: podcastPlatform,
				title,
				durationInSeconds,
				relevance,
			},
		);
	}
}

export class PodcastMother {
	constructor(private readonly podcastFabric: PodcastFabric) {
	}

	public createYoutubePodcast(): Podcast {
		const url = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const platform = "youtube";
		const title = "test";
		const durationInSeconds = createUInt(10 * 60 + 3);
		const relevance = new Date("2019-11-23");
		return this.podcastFabric.createPodcast(
			{
				url,
				platform,
				title,
				durationInSeconds,
				relevance,
			},
		);
	}
}

interface createYoutubeSearchServiceParameters {
	_podcast?: Podcast;
	_podcasts?: Array<Podcast>;
}

export class SearchServiceMockMother {
	private readonly podcastMother: PodcastMother;

	constructor() {
		this.podcastMother = new PodcastMother();
	}

	public createYoutubeSearchService(
		{ _podcast, _podcasts }: createYoutubeSearchServiceParameters,
	): SearchService {
		const mockSearch = mock<SearchService>();
		const searchPlatform = "youtube";
		const podcast = _podcast ?? this.podcastMother.createYoutubePodcast({});
		const podcasts = _podcasts ?? [podcast];
		when(mockSearch.isChannelExist(anyOfClass(URL))).thenResolve(
			true,
		);
		when(mockSearch.getPlatformByURL(anyOfClass(URL))).thenReturn(
			searchPlatform,
		);
		when(
			mockSearch.searchPodcast(
				anyString(),
				anyNumber(),
			),
		).thenResolve(podcasts);
		when(mockSearch.searchByURL(anyOfClass(URL))).thenResolve(podcast);
		when(mockSearch.getLastPodcastsByChannel(anyOfClass(URL), anyNumber()))
			.thenResolve(podcasts);
		const searcher = instance(mockSearch);
		return searcher;
	}
}

interface createYoutubeSearchStrategyParameters {
	_podcast?: Podcast | null;
	_podcasts?: Array<Podcast>;
	_isCorrectUrl?: boolean;
	_isChannelExist?: boolean;
}

export class SearchStrategyMockMother {
	private readonly podcastMother: PodcastMother;

	constructor() {
		this.podcastMother = new PodcastMother();
	}

	public createYoutubeSearchStrategy(
		{ _podcast, _podcasts, _isCorrectUrl, _isChannelExist }:
			createYoutubeSearchStrategyParameters,
	): ISearchStrategy {
		const mockSearchStrategy = mock<ISearchStrategy>();
		const searchPlatform = "youtube";
		let podcast: Podcast | null = null;
		let podcasts: Podcast[] | null = [];
		if (_podcast !== null) {
			podcast = _podcast ??
				this.podcastMother.createYoutubePodcast({});
			podcasts = _podcasts ?? [podcast];
		}
		const isCorrectUrl = _isCorrectUrl ?? true;
		const isChannelExist = _isChannelExist ?? true;
		when(mockSearchStrategy.searchPodcast(anyString(), anyNumber()))
			.thenResolve(podcasts);
		when(mockSearchStrategy.searchByURL(anyOfClass(URL))).thenResolve(
			podcast,
		);
		when(mockSearchStrategy.isCorrectURL(anyOfClass(URL))).thenReturn(
			isCorrectUrl,
		);
		when(mockSearchStrategy.isChannelExist(anyOfClass(URL))).thenResolve(
			isChannelExist,
		);
		when(mockSearchStrategy.getPlatform()).thenReturn(searchPlatform);
		when(
			mockSearchStrategy.getLastPodcastsByChannel(
				anyOfClass(URL),
				anyNumber(),
			),
		).thenResolve(isChannelExist ? podcasts : null);
		const SearchStrategy = instance(mockSearchStrategy);
		return SearchStrategy;
	}
}

interface createSubscribeManageRepositoryParameters {
	_isUserExist?: boolean;
	_subscribes?: Subscribe[];
}

export class SubscribeManageRepositoryMockMother {
	private readonly subscribeMother: SubscribeMother;

	constructor() {
		this.subscribeMother = new SubscribeMother();
	}

	public createSubscribeManageRepository(
		{ _isUserExist, _subscribes }:
			createSubscribeManageRepositoryParameters,
	): ISubscribeManageRepository {
		const mockSubscribeManageRepository = mock<
			ISubscribeManageRepository
		>();
		let subscribes: Subscribe[] | null = null;
		const subscribe = this.subscribeMother.createYoutubeSubscribe({});
		const isUserExist = _isUserExist ?? true;
		if (isUserExist) {
			subscribes = _subscribes ?? [subscribe];
		}
		when(mockSubscribeManageRepository.findSubscribesByUserId(anyNumber()))
			.thenResolve(subscribes);
		when(mockSubscribeManageRepository.subscribe(anyNumber(), anyNumber()))
			.thenResolve(true);
		when(
			mockSubscribeManageRepository.unsubscribe(anyNumber(), anyNumber()),
		).thenResolve(true);
		const subscribeManageRepository = instance(
			mockSubscribeManageRepository,
		);
		return subscribeManageRepository;
	}
}

export class FeedMother {
	private readonly userMother: UserMother;

	constructor() {
		this.userMother = new UserMother();
	}

	public createFeed(startFeedSize?: UInt): Feed {
		const user = this.userMother.createUser({});
		return new Feed(user.id, startFeedSize);
	}
}

export class PodcastStreamMockMother {
	public createPodcastStream(): IPodcastStream {
		const mockPodcastStream = mock<IPodcastStream>();
		const stream = new ReadableStream<Uint8Array<ArrayBuffer>>();
		when(mockPodcastStream.getStream()).thenReturn(stream);
		when(mockPodcastStream.close()).thenReturn();
		const podcastStream = instance(mockPodcastStream);
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
