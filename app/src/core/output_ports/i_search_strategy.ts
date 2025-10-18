import type { Podcast } from "../models/podcast.ts";
import type { SearchPlatform, UInt } from "../types.ts";

export interface GetPodcastsOptions {
	pagination: {
		page: UInt;
		podcastsPerPage: UInt;
	};
}

export interface ISearchStrategy {
	searchPodcast(query: string, max_results: UInt): Promise<Array<Podcast>>;
	/**
	 * Return Podcast if can find, else null
	 * May throw SearchError
	 */
	searchByURL(url: URL): Promise<Podcast | null>;
	/**
	 * Return true if can find channel
	 * May throw SearchError
	 */
	isChannelExist(url: URL): Promise<boolean>;
	/**
	 * Return true if can work with given url
	 */
	isCorrectURL(url: URL): boolean;
	/**
	 * Return null if channel doesn't exist
	 * May throw SearchError
	 *
	 * increment page pointer every call on channel
	 *
	 * using same page number provides UB
	 *
	 * set page number = 1 to clear page pointer
	 *
	 * to change podcast count per page
	 * set page number = 1
	 *
	 * changing podcast count per page
	 * with out setting page number = 1
	 * provides UB
	 */
	getLastPodcastsByChannel(
		channel_url: URL,
		options: GetPodcastsOptions,
	): Promise<Array<Podcast> | null>;
	/**
	 * Return platform of SearchStrategy
	 */
	getPlatform(): SearchPlatform;
}

export class SearchStrategyError extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, SearchStrategyError.prototype);
	}
}

export class SearchError extends SearchStrategyError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, SearchError.prototype);
	}
}

export class SearchStrategyInitializationError extends SearchStrategyError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, SearchError.prototype);
	}
}
