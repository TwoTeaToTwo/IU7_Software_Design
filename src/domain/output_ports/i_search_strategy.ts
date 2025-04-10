import type { Podcast } from "../models/podcast.ts";
import type { SearchPlatform, UInt } from "../types.ts";

export interface ISearchStrategy {
	searchPodcast(query: string): Array<Podcast>;
	searchByURL(url: URL): Podcast;
	/**
	 * Return true if can find channel
	 */
	isChannelExist(url: URL): boolean;
	/**
	 * Return true if can work with given url
	 */
	isCorrectURL(url: URL): boolean;
	getLastPodcastsByChannel(channel_url: URL, count: UInt): Array<Podcast>;
	getPlatform(): SearchPlatform;
}
