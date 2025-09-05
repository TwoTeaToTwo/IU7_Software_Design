import type { SearchService } from "./search_service.ts";
import { Feed } from "../models/feed.ts";
import { inject, injectable } from "npm:inversify";
import type { ISubscribeManageRepository } from "../output_ports/i_subscribe_manage_repository.ts";
import { createUInt, INJECT_TYPES, type UInt } from "../types.ts";
import { UserFindError } from "./errors.ts";
import { coreConfig } from "../config.ts";

export class UnsupportableURLError extends Error {
	constructor() {
		super("ERROR: Unknown platform of url");
		Object.setPrototypeOf(this, UnsupportableURLError.prototype);
	}
}

@injectable()
export class FeedService {
	private readonly startSearchDepth;

	constructor(
		@inject(INJECT_TYPES.SearchService) private _searcher: SearchService,
		@inject(
			INJECT_TYPES.SubscribeManageRepository,
		) private _subscribe_manage_repo: ISubscribeManageRepository,
	) {
		this.startSearchDepth = coreConfig.feedService.searchDepth;
	}
	/**
	 * throw UserFindError if can't find user
	 */
	public async updateFeed(feed: Feed): Promise<void> {
		const subscribes = await this._subscribe_manage_repo
			.findSubscribesByUserId(
				feed.user_id,
			);
		if (subscribes === null) {
			throw new UserFindError();
		} else {
			let search_depth = this.startSearchDepth;
			while (feed.contents.length < feed.max_size) {
				for (
					let i = 0;
					i < subscribes.length && feed.current_size < feed.max_size;
					i++
				) {
					const podcasts = await this._searcher
						.getLastPodcastsByChannel(
							subscribes[i].url,
							createUInt(search_depth),
						);
					for (
						let j = 0;
						j < podcasts.length &&
						feed.current_size < feed.max_size;
						j++
					) {
						const content = podcasts[j];
						feed.addNewContent(content);
					}
				}
				search_depth++;
			}
		}
	}

	public createFeed(
		user_id: UInt,
		start_feed_size = Feed.DEFAULT_FEED_SIZE,
	): Feed {
		return new Feed(user_id, start_feed_size);
	}
}
