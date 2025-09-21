import { assertEquals, assertRejects } from "@std/assert";
import { createUInt, FeedService, UserFindError } from "../mod.ts";
import {
	FeedMother,
	PodcastMother,
	SearchServiceMockMother,
	SubscribeManageRepositoryMockMother,
	SubscribeMother,
} from "../tests/object_mothers.ts";

const podcastMother = new PodcastMother();
const searchServiceMother = new SearchServiceMockMother();
const subscribeMother = new SubscribeMother();
const subscribeManageRepositoryMother =
	new SubscribeManageRepositoryMockMother();
const feedMother = new FeedMother();

Deno.test("FeedService: updateFeed: user exists", async () => {
	const podcast1 = podcastMother.createYoutubePodcast({ title: "test1" });
	const podcast2 = podcastMother.createYoutubePodcast({ title: "test2" });
	const podcasts = [podcast1, podcast2];
	const searchService = searchServiceMother.createYoutubeSearchService({
		_podcasts: podcasts,
	});
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({ _subscribes: subscribes });
	const feed = feedMother.createFeed(createUInt(podcasts.length));
	const feedService = new FeedService(
		searchService,
		subscribeManageRepository,
	);

	await feedService.updateFeed(feed);

	assertEquals(feed.contents, podcasts);
});

Deno.test("FeedService: updateFeed: use doesn't exist", async () => {
	const podcast1 = podcastMother.createYoutubePodcast({ title: "test1" });
	const podcast2 = podcastMother.createYoutubePodcast({ title: "test2" });
	const podcasts = [podcast1, podcast2];
	const searchService = searchServiceMother.createYoutubeSearchService({
		_podcasts: podcasts,
	});
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({
			_subscribes: subscribes,
			_isUserExist: false,
		});
	const feed = feedMother.createFeed(createUInt(podcasts.length));
	const feedService = new FeedService(
		searchService,
		subscribeManageRepository,
	);

	await assertRejects(async () => {
		await feedService.updateFeed(feed);
	}, UserFindError);
});
