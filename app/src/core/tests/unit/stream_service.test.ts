import { assertEquals } from "@std/assert";
import { StreamService } from "@podcast/core";
import type { IStreamStrategy, StreamToolName } from "@podcast/core";
import { PodcastMother } from "@podcast/tests-utils";
import { StreamStrategyMockBuilder } from "../builders.ts";

const podcastMother = new PodcastMother();

Deno.test("StreamService: getToolNameByURL: streamer exists", async () => {
	const podcast = podcastMother.createYoutubePodcast();

	const streamStrategyBuilder = new StreamStrategyMockBuilder();
	streamStrategyBuilder.produceIsSupportedURL(true);
	const streamStrategy = streamStrategyBuilder.createStreamStrategy();
	const streamStrategies = new Map<StreamToolName, IStreamStrategy>();
	streamStrategies.set(streamStrategy.getStrategyName(), streamStrategy);

	const streamService = new StreamService(streamStrategies);

	const result = await streamService.getToolNameByURL(podcast.url);

	assertEquals(result, streamStrategy.getStrategyName());
});

Deno.test("StreamService: getToolNameByURL: streamer doesn't exist", async () => {
	const podcast = podcastMother.createYoutubePodcast();

	const streamStrategyBuilder = new StreamStrategyMockBuilder();
	streamStrategyBuilder.produceIsSupportedURL(false);
	const streamStrategy = streamStrategyBuilder.createStreamStrategy();
	const streamStrategies = new Map<StreamToolName, IStreamStrategy>();
	streamStrategies.set(streamStrategy.getStrategyName(), streamStrategy);

	const streamService = new StreamService(streamStrategies);

	const result = await streamService.getToolNameByURL(podcast.url);

	assertEquals(result, null);
});

// Deno.test("StreamService: streamPodcast: supported url", () => {
// 	const podcast = podcastMother.createYoutubePodcast({});
// 	const podcastStream = podcastStreamMother.createPodcastStream();
// 	const streamStrategy = streamStrategyMother.createYtdlpStreamStrategy({
// 		_podcastStream: podcastStream,
// 	});
// 	const streamStrategies = new Map<StreamToolName, IStreamStrategy>();
// 	streamStrategies.set(streamStrategy.getStrategyName(), streamStrategy);
// 	const streamService = new StreamService(streamStrategies);

// 	streamService.streamPodcast(podcast.url).then((result) =>
// 		assertEquals(result, podcastStream)
// 	);
// });

// Deno.test("StreamService: streamPodcast: unsupported url", async () => {
// 	const podcast = podcastMother.createYoutubePodcast({});
// 	const streamStrategy = streamStrategyMother.createYtdlpStreamStrategy({
// 		_isSupportedUrl: false,
// 	});
// 	const streamStrategies = new Map<StreamToolName, IStreamStrategy>();
// 	streamStrategies.set(streamStrategy.getStrategyName(), streamStrategy);
// 	const streamService = new StreamService(streamStrategies);

// 	await assertRejects(async () => {
// 		await streamService.streamPodcast(podcast.url);
// 	}, UnsupportableURLError);
// });

// Deno.test("StreamService: streamPodcast: podcast stream error", async () => {
// 	const podcast = podcastMother.createYoutubePodcast({});
// 	const streamStrategy = streamStrategyMother.createYtdlpStreamStrategy({
// 		_canStreamPodcast: false,
// 	});
// 	const streamStrategies = new Map<StreamToolName, IStreamStrategy>();
// 	streamStrategies.set(streamStrategy.getStrategyName(), streamStrategy);
// 	const streamService = new StreamService(streamStrategies);

// 	await assertRejects(async () => {
// 		await streamService.streamPodcast(podcast.url);
// 	}, PodcastStreamError);
// });
