import { assertEquals, assertRejects } from "@std/assert";
import {
	createUInt,
	GetPodcastError,
	NonExistentChannelError,
	SearchService,
} from "../mod.ts";
import type { ISearchStrategy, Podcast, SearchPlatform } from "../mod.ts";
import {
	PodcastMother,
	SearchStrategyMockMother,
	SubscribeMother,
} from "../tests/object_mothers.ts";

const podcastMother = new PodcastMother();
const searchStrategyMother = new SearchStrategyMockMother();
const subscribeMother = new SubscribeMother();

Deno.test("SearchService: searchPodcast: search existent podcast", async () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const podcasts = [podcast];
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: podcast, _podcasts: podcasts },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.searchPodcast(podcast.title);

	assertEquals(result, podcasts);
});

Deno.test("SearchService: search non-existent podcast", async () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const podcasts: Podcast[] = [];
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: podcast, _podcasts: podcasts },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.searchPodcast(podcast.title);

	assertEquals(result, podcasts);
});

Deno.test("SearchService: getPlatformByURL: get existent platform", () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: podcast },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = searchService.getPlatformByURL(
		podcast.url,
	);

	assertEquals(result, podcast.platform);
});

Deno.test("SearchService: getPlatformByURL: get non-existent platform", () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: podcast, _isCorrectUrl: false },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = searchService.getPlatformByURL(
		podcast.url,
	);

	assertEquals(result, null);
});

Deno.test("SearchService: searchByURL: get existent podcast", async () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: podcast },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.searchByURL(podcast.url);

	assertEquals(result, podcast);
});

Deno.test("SearchService: searchByURL: get non-existent podcast", async () => {
	const podcast = podcastMother.createYoutubePodcast({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcast: null },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	await assertRejects(async () => {
		await searchService.searchByURL(podcast.url);
	}, GetPodcastError);
});

Deno.test("SearchService: isChannelExist: get existent channel", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy({});
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.isChannelExist(subscribe.url);

	assertEquals(result, true);
});

Deno.test("SearchService: isChannelExist: get non-existent channel", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy({
		_isChannelExist: false,
	});
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.isChannelExist(subscribe.url);

	assertEquals(result, false);
});

Deno.test("SearchService: getLastPodcastsByChannel: channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const podcast1 = podcastMother.createYoutubePodcast({ title: "test1" });
	const podcast2 = podcastMother.createYoutubePodcast({ title: "test2" });
	const podcasts = [podcast1, podcast2];
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _podcasts: podcasts },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	const result = await searchService.getLastPodcastsByChannel(
		subscribe.url,
		createUInt(podcasts.length),
	);

	assertEquals(result, podcasts);
});

Deno.test("SearchService: getLastPodcastsByChannel: channel doesn't exist", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const searchStrategy = searchStrategyMother.createYoutubeSearchStrategy(
		{ _isChannelExist: false },
	);
	const searchStrategies = new Map<SearchPlatform, ISearchStrategy>();
	searchStrategies.set(searchStrategy.getPlatform(), searchStrategy);
	const searchService = new SearchService(searchStrategies);

	await assertRejects(async () => {
		await searchService.getLastPodcastsByChannel(
			subscribe.url,
		);
	}, NonExistentChannelError);
});
