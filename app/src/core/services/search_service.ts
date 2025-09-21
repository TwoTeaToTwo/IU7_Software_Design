import type { Podcast } from "../models/podcast.ts";
import type { ISearchStrategy } from "../output_ports/i_search_strategy.ts";
import type { SearchPlatform, UInt } from "../types.ts";
import { inject, injectable } from "inversify";
import { createUInt, INJECT_TYPES } from "../types.ts";

export class UnknownPlatformError extends Error {
	constructor() {
		super("ERROR: Unknown platform");
		Object.setPrototypeOf(this, UnknownPlatformError.prototype);
	}
}

export class GetPodcastError extends Error {
	constructor() {
		super("ERROR: can't find podcast using url");
		Object.setPrototypeOf(this, GetPodcastError.prototype);
	}
}

export class GetSearcherError extends Error {
	constructor(platform: SearchPlatform) {
		super(`ERROR: can't find implementation for searcher ${platform}`);
		Object.setPrototypeOf(this, GetSearcherError.prototype);
	}
}

export class NonExistentChannelError extends Error {
	constructor() {
		super("ERROR: can't find channel using url");
		Object.setPrototypeOf(this, NonExistentChannelError.prototype);
	}
}

@injectable()
export class SearchService {
	constructor(
		@inject(INJECT_TYPES.SearchStrategies) private _searchers: Map<
			SearchPlatform,
			ISearchStrategy
		>,
	) {}
	public async searchPodcast(
		query: string,
		max_results: UInt = createUInt(5),
	): Promise<Array<Podcast>> {
		const podcasts: Array<Podcast> = new Array<Podcast>();
		for (const searcher of this._searchers) {
			podcasts.push(
				...await searcher[1].searchPodcast(query, max_results),
			);
		}
		return podcasts;
	}
	public getPlatformByURL(url: URL): SearchPlatform | null {
		let platform: SearchPlatform | null = null;
		for (const searcher of this._searchers) {
			if (searcher[1].isCorrectURL(url)) {
				platform = searcher[0];
				break;
			}
		}
		return platform;
	}
	/**
	 * throw UnknownPlatformError if can't find platform of URL
	 *
	 * throw GetSearcherError if can't find searcher for platform
	 *
	 * throw GetPodcastError if can't find podcast
	 */
	public async searchByURL(url: URL): Promise<Podcast> {
		const platform = this.getPlatformByURL(url);
		if (platform === null) {
			throw new UnknownPlatformError();
		} else {
			const search = this._searchers.get(platform);
			if (search === undefined) {
				throw new GetSearcherError(platform);
			} else {
				const podcast = await search.searchByURL(url);
				if (podcast === null) {
					throw new GetPodcastError();
				} else {
					return podcast;
				}
			}
		}
	}
	/**
	 * return false if can't find platform of URL
	 * or can't find channel
	 *
	 * return true if channel exist
	 */
	public async isChannelExist(url: URL): Promise<boolean> {
		const platform = this.getPlatformByURL(url);
		let is_exist: boolean;
		if (platform === null) {
			is_exist = false;
		} else {
			const search = this._searchers.get(platform);
			is_exist = await search!.isChannelExist(url);
		}
		return is_exist;
	}
	/**
	 * throw UnknownPlatformError if can't find channel's platform
	 *
	 * throw NonExistentChannelError if can't find channel
	 */
	public async getLastPodcastsByChannel(
		channel_url: URL,
		count: UInt = createUInt(5),
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		const platform = this.getPlatformByURL(channel_url);
		if (platform === null) {
			throw new UnknownPlatformError();
		} else {
			const search = this._searchers.get(platform);
			const last_podcasts = await search!.getLastPodcastsByChannel(
				channel_url,
				count,
			);
			if (last_podcasts === null) {
				throw new NonExistentChannelError();
			} else {
				podcasts.push(
					...last_podcasts,
				);
			}
		}
		return podcasts;
	}
}
