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
	ISearchStrategy,
	ISubscribeManageRepository,
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
	public createUser(id?: Id, login?: string, password?: Password): User {
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

export class PodcastMother {
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
		const user = this.userMother.createUser();
		return new Feed(user.id, startFeedSize);
	}
}
