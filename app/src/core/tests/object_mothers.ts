import { createUInt, Password, Podcast, Subscribe, User } from "../mod.ts";
import type {
	Id,
	ISearchStrategy,
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

export class SubscribeMother {
	public createSubscribe(
		platform: SearchPlatform,
		url: URL,
		id?: Id,
		title?: string,
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
		id?: Id,
		url?: URL,
		title?: string,
	): Subscribe {
		const subscribeUrl = url ??
			new URL("https://www.youtube.com/@MrVrschool");
		const subscribePlatform = "youtube";
		return this.createSubscribe(subscribePlatform, subscribeUrl, id, title);
	}
}

export class PodcastMother {
	public createPodcast(
		url: URL,
		platform: SearchPlatform,
		title?: string,
		durationInSeconds?: UInt,
		relevance?: Date,
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
		title?: string,
		durationInSeconds?: UInt,
		relevance?: Date,
	): Podcast {
		const podcastUrl = new URL(
			"https://www.youtube.com/watch?v=4xST-Kz9pEI",
		);
		const podcastPlatform = "youtube";
		return this.createPodcast(
			podcastUrl,
			podcastPlatform,
			title,
			durationInSeconds,
			relevance,
		);
	}
}

export class SearchServiceMockMother {
	private readonly podcastMother: PodcastMother;

	constructor() {
		this.podcastMother = new PodcastMother();
	}

	public createYoutubeSearchService(
		_podcast?: Podcast,
		_podcasts?: Array<Podcast>,
	): SearchService {
		const mockSearch = mock<SearchService>();
		const searchPlatform = "youtube";
		const podcast = _podcast ?? this.podcastMother.createYoutubePodcast();
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
				this.podcastMother.createYoutubePodcast();
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
