import { Container } from "inversify";
import {
	Feed,
	FeedService,
	type ISubscribeManageRepository,
	Podcast,
	SearchService,
	Subscribe,
} from "../mod.ts";
import type { ISearchStrategy } from "../mod.ts";
import { anyNumber, anyOfClass, instance, mock, when } from "ts-mockito";
import { createUInt, INJECT_TYPES, type SearchPlatform } from "../types.ts";
import { assertEquals } from "@std/assert";

Deno.test("FeedService: updateFeed: positive test", async () => {
	// Create Searcher
	const mock_searcher = mock<ISearchStrategy>();
	const channel_url_1 = new URL(
		"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
	);
	const channel_url_2 = new URL("https://www.youtube.com/@IzzyLaif");
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	const podcasts1 = [
		new Podcast(
			new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J"),
			"Never Gonna Give You Up",
			"youtube",
			createUInt(212),
			new Date("2009-10-15"),
		),
		new Podcast(
			new URL("https://youtu.be/yPYZpwSpKmA?si=7vhG52GwLrRXBC27"),
			"Together Forever",
			"youtube",
			createUInt(213),
			new Date("2009-10-25"),
		),
	];
	const podcasts2 = [
		new Podcast(
			new URL("https://youtu.be/AMRND4IN0zc?si=qE2BzpGNRibVaj2I"),
			"Older soup",
			"youtube",
			createUInt(212),
			new Date("2024-09-15"),
		),
		new Podcast(
			new URL("https://youtu.be/6O_6KVdYOx8?si=ZA6rl5-vFEK3zprP"),
			"Steam deck",
			"youtube",
			createUInt(213),
			new Date("2024-08-31"),
		),
	];
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.getLastPodcastsByChannel(channel_url_1, anyNumber()))
		.thenReturn(Promise.resolve(podcasts1));
	when(mock_searcher.getLastPodcastsByChannel(channel_url_2, anyNumber()))
		.thenReturn(Promise.resolve(podcasts2));
	const searcher = instance(mock_searcher);

	// Create Subscribe Repository
	const subscribes = [
		new Subscribe(
			createUInt(1),
			channel_url_1,
			"Rick Astley",
			"123",
		),
		new Subscribe(
			createUInt(2),
			channel_url_2,
			"IzzyLaif",
			"123",
		),
	];
	const mock_subscribe_repo: ISubscribeManageRepository = {
		findSubscribesByUserId: (_id) => Promise.resolve(subscribes),
		subscribe: (_user_id, _subscribe_id) => Promise.resolve(true),
		unsubscribe: (_user_id, _subscribe_id) => Promise.resolve(true),
	};

	// Create SearchService
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);

	// Create Feed Service
	test_container.bind<ISubscribeManageRepository>(
		INJECT_TYPES.SubscribeManageRepository,
	)
		.toConstantValue(mock_subscribe_repo);
	test_container.bind<FeedService>(INJECT_TYPES.FeedService).to(FeedService);
	const feed_service = test_container.get<FeedService>(
		INJECT_TYPES.FeedService,
	);

	//test
	const feed = new Feed(createUInt(1), 4);
	await feed_service.updateFeed(feed);
	assertEquals(feed.contents, [...podcasts1, ...podcasts2]);
});
