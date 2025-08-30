import { YoutubeSearchStrategy } from "./youtube_search_strategy.ts";
import { createUInt, Podcast } from "@podcast/core";
import { assertEquals, assertNotEquals } from "jsr:@std/assert";

Deno.test("YoutubeSearchStrategy: searchPodcast", async () => {
	const youtube_search = new YoutubeSearchStrategy();
	const query = "never gonna give you up";
	const podcasts = await youtube_search.searchPodcast(query, createUInt(1));
	if (podcasts.length === 0) {
		assertNotEquals(podcasts.length, 0);
	}
	const url = new URL(
		"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	);
	const title =
		"Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)";
	const duration_seconds = createUInt(3 * 60 + 33 + 1);
	const relevance = new Date("2009-10-25T06:57:33.000Z");
	const podcast = new Podcast(
		url,
		title,
		youtube_search.getPlatform(),
		duration_seconds,
		relevance,
	);
	const result = podcasts[0];
	assertEquals(podcast, result);
});

Deno.test("YoutubeSearchStrategy: searchByURL", async () => {
	const youtube_search = new YoutubeSearchStrategy();
	const url = new URL("https://youtu.be/jXzsVT-V54k?si=PXuTmXd5E0kFkce8");
	const podcast = await youtube_search.searchByURL(url);
	console.log(podcast);
	assertEquals(podcast !== null, true);
});

Deno.test("YoutubeSearchStrategy: getLastPodcastsByChannel", async () => {
	const youtube_search = new YoutubeSearchStrategy();
	const channel_url = new URL("https://www.youtube.com/@izzylie");
	const podcasts = await youtube_search.getLastPodcastsByChannel(
		channel_url,
		createUInt(5),
	);
	if (podcasts !== null) {
		if (podcasts.length === 0) {
			assertNotEquals(podcasts.length, 0);
		}
		console.log(podcasts.length);
		for (const podcast of podcasts) {
			console.log(podcast);
		}
	}
	assertEquals(podcasts !== null, true);
});
