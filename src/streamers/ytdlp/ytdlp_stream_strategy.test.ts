import { YTDLPStreamStrategy } from "./ytdlp_stream_strategy.ts";
import { createUInt, Podcast } from "@podcast/core";
import { assertEquals, assertNotEquals } from "jsr:@std/assert";

Deno.test("YTDLPStreamStrategy: isSupportedURL: supported url", async () => {
	const streamer = new YTDLPStreamStrategy();

	assertEquals(podcast, result);
});

Deno.test("YTDLPStreamStrategy: isSupportedURL: unsupported url", async () => {
	const youtube_search = new YoutubeSearchStrategy();
	const url = new URL("https://youtu.be/jXzsVT-V54k?si=PXuTmXd5E0kFkce8");
	const podcast = await youtube_search.searchByURL(url);
	console.log(podcast);
	assertEquals(podcast !== null, true);
});
