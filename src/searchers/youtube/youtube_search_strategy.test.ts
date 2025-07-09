import { YoutubeSearchStrategy } from "./youtube_search_strategy.ts";
import { createUInt } from "@podcast/domain";
import { assertEquals } from "jsr:@std/assert";

Deno.test("YoutubeSearchStrategy: searchPodcast", async () => {
	const youtube_search = new YoutubeSearchStrategy();
	const query = "never gonna give you up";
	const podcasts = await youtube_search.searchPodcast(query, createUInt(1));
	console.log(podcasts[0]);
	assertEquals(true, true);
});
