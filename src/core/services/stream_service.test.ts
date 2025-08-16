import { Container } from "inversify";
import {
	INJECT_TYPES,
	PodcastStreamError,
	StreamService,
	UnsupportableURLError,
} from "../mod.ts";
import type { IStreamStrategy, StreamToolName } from "../mod.ts";
import { anyOfClass, instance, mock, when } from "npm:ts-mockito";
import { assertEquals, assertRejects } from "jsr:@std/assert";

Deno.test("StreamService: getToolNameByURL: streamer exists", async () => {
	const mock_streamer = mock<IStreamStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	when(mock_streamer.isSupportedURL(anyOfClass(URL))).thenReturn(
		Promise.resolve(true),
	);
	when(mock_streamer.getStrategyName()).thenReturn("ytdlp");
	const test_container = new Container();
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const streamer = instance(mock_streamer);
	stream_strategies.set(streamer.getStrategyName(), streamer);
	test_container.bind<StreamService>(INJECT_TYPES.StreamService).to(
		StreamService,
	);
	test_container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	const stream_service = test_container.get<StreamService>(
		INJECT_TYPES.StreamService,
	);
	const result = await stream_service.getToolNameByURL(url);
	assertEquals(result, streamer.getStrategyName());
});

Deno.test("StreamService: getToolNameByURL: streamer doesn't exist", async () => {
	const mock_streamer = mock<IStreamStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	when(mock_streamer.isSupportedURL(anyOfClass(URL))).thenReturn(
		Promise.resolve(false),
	);
	when(mock_streamer.getStrategyName()).thenReturn("ytdlp");
	const test_container = new Container();
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const streamer = instance(mock_streamer);
	stream_strategies.set(streamer.getStrategyName(), streamer);
	test_container.bind<StreamService>(INJECT_TYPES.StreamService).to(
		StreamService,
	);
	test_container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	const stream_service = test_container.get<StreamService>(
		INJECT_TYPES.StreamService,
	);
	const result = await stream_service.getToolNameByURL(url);
	assertEquals(result, null);
});

Deno.test("StreamService: streamPodcast: supported url", async () => {
	const mock_streamer = mock<IStreamStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	const r_stream = new ReadableStream<Uint8Array<ArrayBuffer>>();
	when(mock_streamer.isSupportedURL(anyOfClass(URL))).thenReturn(
		Promise.resolve(true),
	);
	when(mock_streamer.getStrategyName()).thenReturn("ytdlp");
	when(mock_streamer.streamPodcast(anyOfClass(URL))).thenReturn(r_stream);
	const test_container = new Container();
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const streamer = instance(mock_streamer);
	stream_strategies.set(streamer.getStrategyName(), streamer);
	test_container.bind<StreamService>(INJECT_TYPES.StreamService).to(
		StreamService,
	);
	test_container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	const stream_service = test_container.get<StreamService>(
		INJECT_TYPES.StreamService,
	);
	const result = await stream_service.streamPodcast(url);
	assertEquals(result, r_stream);
});

Deno.test("StreamService: streamPodcast: unsupported url", async () => {
	const mock_streamer = mock<IStreamStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	const r_stream = new ReadableStream<Uint8Array<ArrayBuffer>>();
	when(mock_streamer.isSupportedURL(anyOfClass(URL))).thenReturn(
		Promise.resolve(false),
	);
	when(mock_streamer.getStrategyName()).thenReturn("ytdlp");
	when(mock_streamer.streamPodcast(anyOfClass(URL))).thenReturn(r_stream);
	const test_container = new Container();
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const streamer = instance(mock_streamer);
	stream_strategies.set(streamer.getStrategyName(), streamer);
	test_container.bind<StreamService>(INJECT_TYPES.StreamService).to(
		StreamService,
	);
	test_container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	const stream_service: StreamService = test_container.get<StreamService>(
		INJECT_TYPES.StreamService,
	);
	await assertRejects(async () => {
		const _result = await stream_service.streamPodcast(url);
	}, UnsupportableURLError);
});

Deno.test("StreamService: streamPodcast: podcast stream error", async () => {
	const mock_streamer = mock<IStreamStrategy>();
	const url = new URL("https://youtu.be/dQw4w9WgXcQ?si=hve9SXqixHyDCs3J");
	when(mock_streamer.isSupportedURL(anyOfClass(URL))).thenReturn(
		Promise.resolve(true),
	);
	when(mock_streamer.getStrategyName()).thenReturn("ytdlp");
	when(mock_streamer.streamPodcast(anyOfClass(URL))).thenReturn(null);
	const test_container = new Container();
	const stream_strategies = new Map<StreamToolName, IStreamStrategy>();
	const streamer = instance(mock_streamer);
	stream_strategies.set(streamer.getStrategyName(), streamer);
	test_container.bind<StreamService>(INJECT_TYPES.StreamService).to(
		StreamService,
	);
	test_container.bind(INJECT_TYPES.StreamStrategies).toConstantValue(
		stream_strategies,
	);
	const stream_service: StreamService = test_container.get<StreamService>(
		INJECT_TYPES.StreamService,
	);
	await assertRejects(async () => {
		const _result = await stream_service.streamPodcast(url);
	}, PodcastStreamError);
});
