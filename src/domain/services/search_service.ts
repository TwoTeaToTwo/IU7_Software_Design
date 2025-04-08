import type { Podcast } from "../models/podcast.ts";
import type { ISearchStrategy } from "../output_ports/i_search_strategy.ts";
import type { Platform, UInt } from "../types.ts";
import { inject, injectable } from "inversify";

export class UnknownPlatformError extends Error {
	constructor() {
		super("ERROR: Unknown platform");
		Object.setPrototypeOf(this, UnknownPlatformError.prototype);
	}
}

export const SearchStrategiesSymbol = Symbol.for("SearchStrategies");
export const SearchServiceSymbol = Symbol.for("SearchService");

@injectable()
export class SearchService {
	constructor(
		@inject(SearchStrategiesSymbol) private _searchers: Map<
			Platform,
			ISearchStrategy
		>,
	) {}
	public searchPodcast(query: string): Array<Podcast> {
		const podcasts: Array<Podcast> = new Array<Podcast>();
		for (const searcher of this._searchers) {
			podcasts.push(...searcher[1].searchPodcast(query));
		}
		return podcasts;
	}
	public getPlatformByURL(url: URL): Platform | null {
		let platform: Platform | null = null;
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
	 */
	public searchByURL(url: URL): Podcast {
		const platform = this.getPlatformByURL(url);
		if (platform === null) {
			throw new UnknownPlatformError();
		} else {
			const search = this._searchers.get(platform);
			return search!.searchByURL(url);
		}
	}
	/**
	 * return false if can't find platform of URL
	 * or can't find channel
	 * return true if channel exist
	 */
	public isChannelExist(url: URL): boolean {
		const platform = this.getPlatformByURL(url);
		let is_exist: boolean;
		if (platform === null) {
			is_exist = false;
		} else {
			const search = this._searchers.get(platform);
			is_exist = search!.isChannelExist(url);
		}
		return is_exist;
	}
	/**
	 * throw UnknownPlatformError if can't find channel
	 */
	public getLastPodcastsByChannel(
		channel_url: URL,
		count: UInt,
	): Array<Podcast> {
		const podcasts = new Array<Podcast>();
		const platform = this.getPlatformByURL(channel_url);
		if (platform === null) {
			throw new UnknownPlatformError();
		} else {
			const search = this._searchers.get(platform);
			podcasts.push(
				...search!.getLastPodcastsByChannel(channel_url, count),
			);
		}
		return podcasts;
	}
}
