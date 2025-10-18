import type { SearchService } from "./search_service.ts";
import type { GetPodcastsOptions } from "../output_ports/i_search_strategy.ts";
import { inject, injectable } from "inversify";
import type { ISubscribeManageRepository } from "../output_ports/i_subscribe_manage_repository.ts";
import { createUInt, type Id, INJECT_TYPES } from "../types.ts";
import { UserFindError } from "./errors.ts";
import { coreConfig } from "../config.ts";
import type { Podcast } from "../models/podcast.ts";

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
	 *
	 * increment page pointer every call
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
	public async getFeedPageContent(
		userId: Id,
		options: GetPodcastsOptions,
	): Promise<Podcast[]> {
		const subscribes = await this._subscribe_manage_repo
			.findSubscribesByUserId(
				userId,
			);
		const podcasts = new Array<Podcast>();
		const page = options.pagination.page;
		if (subscribes === null) {
			throw new UserFindError();
		} else {
			let podcastsPerSubscribe = createUInt(
				options.pagination.podcastsPerPage /
					subscribes.length,
			);
			if (podcastsPerSubscribe < 1) {
				podcastsPerSubscribe = createUInt(1);
			}
			for (
				let i = 0;
				i < subscribes.length &&
				podcasts.length <= options.pagination.podcastsPerPage;
				i++
			) {
				const channelContent = await this._searcher
					.getLastPodcastsByChannel(
						subscribes[i].url,
						{
							pagination: {
								page: page,
								podcastsPerPage: podcastsPerSubscribe,
							},
						},
					);
				for (
					let j = 0;
					j < channelContent.length &&
					podcasts.length <= options.pagination.podcastsPerPage;
					j++
				) {
					podcasts.push(channelContent[j]);
				}
			}
		}
		return podcasts;
	}
}
