import {
	durationSecondsToText,
	type PodcastViewModel,
	relevanceToText,
} from "../PodcastViewModel.ts";
import { api, domain } from "../../Config.ts";
import type { ErrorHandler } from "../../types.ts";
import { browser } from "$app/environment";

interface FeedResponse {
	podcasts: Array<PodcastViewModel>;
	pagination: {
		page: number;
		podcasts_per_page: number;
		total_podcasts: number;
	};
}

export const getFeedContent = async (
	feed_size: number,
	access_token: string,
	errorHandler: ErrorHandler,
): Promise<Array<PodcastViewModel> | undefined> => {
	if (browser) {
		try {
			const response = await fetch(
				`${domain}/${api}/users/contents?page=1&podcasts_per_page=${feed_size}`,
				{
					method: "GET",
					headers: {
						Authorization: access_token,
						"Content-Type": "application/json",
					},
				},
			);
			if (!response.ok) {
				errorHandler("Can't update feed");
			} else {
				const { podcasts } = (await response.json()) as FeedResponse;
				for (const podcast of podcasts) {
					podcast.durationText = durationSecondsToText(
						podcast.duration_s,
					);
					podcast.relevanceText = relevanceToText(
						new Date(podcast.relevance),
					);
				}
				return podcasts;
			}
		} catch {
			errorHandler("Can't update feed");
		}
		return undefined;
	}
};
