import type { SearchService } from "./search_service.ts";
import type { Feed } from "../models/feed.ts";
import { inject, injectable } from "npm:inversify";
import type { ISubscribeRepository } from "../output_ports/i_subscribe_repository.ts";
import { createUInt, INJECT_TYPES } from "../types.ts";
import { UserFindError } from "./errors.ts";

export class UnsupportableURLError extends Error {
	constructor() {
		super("ERROR: Unknown platform of url");
		Object.setPrototypeOf(this, UnsupportableURLError.prototype);
	}
}

@injectable()
export class FeedService {
	constructor(
		@inject(INJECT_TYPES.SearchService) private _searcher: SearchService,
		@inject(INJECT_TYPES.SubscribeRepository) private _subscribe_repo:
			ISubscribeRepository,
	) {}
	/**
	 * throw UserFindError if can't find user
	 */
	public updateFeed(feed: Feed): void {
		const subscribes = this._subscribe_repo.findByUserId(feed.user_id);
		if (subscribes === null) {
			throw new UserFindError();
		} else {
			for (const subscribe of subscribes) {
				const podcasts = this._searcher.getLastPodcastsByChannel(
					subscribe.url,
					createUInt(feed.search_depth),
				);
				for (const content of podcasts) {
					feed.addContent(content);
				}
			}
		}
	}
}
