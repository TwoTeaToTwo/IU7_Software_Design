import { Container } from "inversify";
import {
	createUInt,
	GetPodcastError,
	INJECT_TYPES,
	NonExistentChannelError,
	Podcast,
	type SearchPlatform,
	SearchService,
} from "../mod.ts";
import type { ISearchStrategy } from "../mod.ts";
import {
	anyNumber,
	anyOfClass,
	anyString,
	instance,
	mock,
	when,
} from "npm:ts-mockito";
import { assertEquals, assertRejects } from "jsr:@std/assert";

Deno.test("SearchService: searchPodcast: search existent podcast", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const podcasts = new Array<Podcast>();
	const podcast = new Podcast(
		new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J"),
		"Never Gonna Give You Up",
		"youtube",
		createUInt(212),
		new Date("2009-10-15"),
	);
	podcasts.push(podcast);
	when(mock_searcher.searchPodcast(anyString(), anyNumber())).thenReturn(
		Promise.resolve(podcasts),
	);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.searchPodcast(
		"Never Gonna Give You Up",
	);
	assertEquals(result, podcasts);
});

Deno.test("SearchService: search non-existent podcast", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const podcasts = new Array<Podcast>();
	when(mock_searcher.searchPodcast(anyString(), anyNumber())).thenReturn(
		Promise.resolve(podcasts),
	);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.searchPodcast(
		"Never Gonna Give You Up",
	);
	assertEquals(result, podcasts);
});

Deno.test("SearchService: getPlatformByURL: get existent platform", () => {
	const mock_searcher = mock<ISearchStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = search_service.getPlatformByURL(
		url,
	);
	assertEquals(result, searcher.getPlatform());
});

Deno.test("SearchService: getPlatformByURL: get non-existent platform", () => {
	const mock_searcher = mock<ISearchStrategy>();
	when(
		mock_searcher.isCorrectURL(
			new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J"),
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = search_service.getPlatformByURL(
		new URL("https://rutube.ru/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J"),
	);
	assertEquals(result, null);
});

Deno.test("SearchService: searchByURL: get existent podcast", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const podcast_url = new URL(
		"https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J",
	);
	const podcast = new Podcast(
		podcast_url,
		"Never Gonna Give You Up",
		"youtube",
		createUInt(212),
		new Date("2009-10-15"),
	);
	when(
		mock_searcher.isCorrectURL(
			podcast_url,
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.searchByURL(podcast_url)).thenReturn(
		Promise.resolve(podcast),
	);
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.searchByURL(podcast_url);
	assertEquals(result, podcast);
});

Deno.test("SearchService: searchByURL: get non-existent podcast", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const podcast_url = new URL(
		"https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J",
	);
	when(
		mock_searcher.isCorrectURL(
			podcast_url,
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.searchByURL(podcast_url)).thenReturn(
		Promise.resolve(null),
	);
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	await assertRejects(async () => {
		const _result = await search_service.searchByURL(podcast_url);
	}, GetPodcastError);
});

Deno.test("SearchService: isChannelExist: get existent channel", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const channel_url = new URL(
		"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
	);
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.isChannelExist(channel_url)).thenReturn(
		Promise.resolve(true),
	);
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.isChannelExist(channel_url);
	assertEquals(result, true);
});

Deno.test("SearchService: isChannelExist: get non-existent channel", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const channel_url = new URL(
		"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
	);
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.isChannelExist(anyOfClass(URL))).thenReturn(
		Promise.resolve(false),
	);
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.isChannelExist(channel_url);
	assertEquals(result, false);
});

Deno.test("SearchService: getLastPodcastsByChannel: channel exists", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const channel_url = new URL(
		"https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
	);
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	const podcasts = [
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
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.getLastPodcastsByChannel(channel_url, anyNumber()))
		.thenReturn(Promise.resolve(podcasts));
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	const result = await search_service.getLastPodcastsByChannel(
		channel_url,
		createUInt(2),
	);
	assertEquals(result, podcasts);
});

Deno.test("SearchService: getLastPodcastsByChannel: channel doesn't exist", async () => {
	const mock_searcher = mock<ISearchStrategy>();
	const channel_url = new URL(
		"https://www.youtube.com/channel/123",
	);
	when(
		mock_searcher.isCorrectURL(
			anyOfClass(URL),
		),
	).thenReturn(true);
	when(mock_searcher.getPlatform()).thenReturn("youtube");
	when(mock_searcher.getLastPodcastsByChannel(channel_url, anyNumber()))
		.thenReturn(Promise.resolve(null));
	const test_container = new Container();
	const search_strategies = new Map<SearchPlatform, ISearchStrategy>();
	const searcher = instance(mock_searcher);
	search_strategies.set(searcher.getPlatform(), searcher);
	test_container.bind<SearchService>(INJECT_TYPES.SearchService).to(
		SearchService,
	);
	test_container.bind(INJECT_TYPES.SearchStrategies).toConstantValue(
		search_strategies,
	);
	const search_service = test_container.get<SearchService>(
		INJECT_TYPES.SearchService,
	);
	await assertRejects(async () => {
		const _result = await search_service.getLastPodcastsByChannel(
			channel_url,
			createUInt(2),
		);
	}, NonExistentChannelError);
});
