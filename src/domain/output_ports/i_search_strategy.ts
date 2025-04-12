import type { Podcast } from "../models/podcast.ts";
import type { SearchPlatform, UInt } from "../types.ts";

export interface ISearchStrategy {
	searchPodcast(query: string): Array<Podcast>;
	/**
	 * Return Podcast if can find, else null
	 */
	searchByURL(url: URL): Podcast | null;
	/**
	 * Return true if can find channel
	 */
	isChannelExist(url: URL): boolean;
	/**
	 * Return true if can work with given url
	 */
	isCorrectURL(url: URL): boolean;
	/**
	 * Return null if channel doesn't exist
	 */
	getLastPodcastsByChannel(
		channel_url: URL,
		count: UInt,
	): Array<Podcast> | null;
	getPlatform(): SearchPlatform;
}
