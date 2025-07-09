import type { Podcast } from "../models/podcast.ts";
import type { SearchPlatform, UInt } from "../types.ts";

export interface ISearchStrategy {
	searchPodcast(query: string, max_results: UInt): Promise<Array<Podcast>>;
	/**
	 * Return Podcast if can find, else null
	 */
	searchByURL(url: URL): Promise<Podcast | null>;
	/**
	 * Return true if can find channel
	 */
	isChannelExist(url: URL): Promise<boolean>;
	/**
	 * Return true if can work with given url
	 */
	isCorrectURL(url: URL): boolean;
	/**
	 * Return null if channel doesn't exist
	 */
	getLastPodcastsByChannel(
		channel_url: URL,
		max_results: UInt,
	): Promise<Array<Podcast> | null>;
	/**
	 * Return platform of SearchStrategy
	 */
	getPlatform(): SearchPlatform;
}
