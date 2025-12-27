import { assertEquals, assertRejects } from "@std/assert";
import { FeedService, UserFindError } from "@podcast/core";
import {
	FeedMother,
	PodcastMother,
	SubscribeMother,
} from "@podcast/tests-utils";
import {
	SearchServiceMockBuilder,
	SubscribeManageRepositoryMockBuilder,
} from "../builders.ts";

const podcastMother = new PodcastMother();
const subscribeMother = new SubscribeMother();
const feedMother = new FeedMother();

Deno.test("FeedService: updateFeed: user exists", async () => {
	const podcast = podcastMother.createYoutubePodcast();
	const podcasts = [podcast];
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const subscribes = [subscribe];

	const searchServiceBuilder = new SearchServiceMockBuilder();
	searchServiceBuilder.produceGetLastPodcastsByChannel(podcasts);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceFindSubscribesByUserId(subscribes);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const feed = feedMother.createFeed();
	const feedService = new FeedService(
		searchService,
		subscribeManageRepository,
	);

	await feedService.updateFeed(feed);

	assertEquals(feed.contents, podcasts);
});

Deno.test("FeedService: updateFeed: use doesn't exist", async () => {
	const podcast = podcastMother.createYoutubePodcast();
	const podcasts = [podcast];

	const searchServiceBuilder = new SearchServiceMockBuilder();
	searchServiceBuilder.produceGetLastPodcastsByChannel(podcasts);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceFindSubscribesByUserId(null);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const feed = feedMother.createFeed();
	const feedService = new FeedService(
		searchService,
		subscribeManageRepository,
	);

	await assertRejects(async () => {
		await feedService.updateFeed(feed);
	}, UserFindError);
});
