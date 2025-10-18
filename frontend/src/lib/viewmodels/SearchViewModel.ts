import {
	durationSecondsToText,
	type PodcastViewModel,
	relevanceToText,
} from "./PodcastViewModel.ts";
import type { messageHandler } from "../types.ts";
import { api, domain } from "../Config.ts";

interface SearchResponse {
	podcasts: Array<PodcastViewModel>;
	pagination: {
		page: number;
		podcasts_per_page: number;
		total_podcasts: number;
	};
}

const isUrl = (query: string): boolean => {
	try {
		const _ = new URL(query);
		return true;
	} catch {
		return false;
	}
};

const searchByQuery = async (
	query: string,
	maxResults: number,
	accessToken: string,
	messageHandler: messageHandler,
): Promise<Array<PodcastViewModel> | undefined> => {
	try {
		const responseURL =
			`${domain}/${api}/podcasts?query=${query}&page=1&podcasts_per_page=${maxResults}`;
		const response = await fetch(responseURL, {
			method: "GET",
			headers: {
				Authorization: accessToken,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			messageHandler("Can't find podcasts", "ERROR");
		} else {
			const { podcasts } = (await response.json()) as SearchResponse;
			for (const podcast of podcasts) {
				podcast.durationText = durationSecondsToText(
					podcast.duration_s,
				);
				podcast.relevanceText = relevanceToText(
					new Date(podcast.relevance),
				);
			}
			messageHandler("Podcasts has founded", "SEARCH");
			return podcasts;
		}
	} catch {
		messageHandler("Can't find podcasts", "ERROR");
	}
	return undefined;
};

const searchByUrl = async (
	url: string,
	accessToken: string,
	messageHandler: messageHandler,
): Promise<Array<PodcastViewModel> | undefined> => {
	try {
		const responseURL = `${domain}/${api}/podcasts?url=${url}`;
		const response = await fetch(responseURL, {
			method: "GET",
			headers: {
				Authorization: accessToken,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			messageHandler("Can't find podcast", "ERROR");
		} else {
			const { podcasts } = (await response.json()) as SearchResponse;
			podcasts[0].durationText = durationSecondsToText(
				podcasts[0].duration_s,
			);
			podcasts[0].relevanceText = relevanceToText(
				new Date(podcasts[0].relevance),
			);
			messageHandler("Podcasts has founded", "SEARCH");
			return podcasts;
		}
	} catch {
		messageHandler("Can't find podcast", "ERROR");
	}
	return undefined;
};

export const searchPodcast = async (
	query: string,
	maxResults: number,
	accessToken: string,
	messageHandler: messageHandler,
): Promise<Array<PodcastViewModel> | undefined> => {
	let podcasts: Array<PodcastViewModel> | undefined;
	if (isUrl(query)) {
		podcasts = await searchByUrl(query, accessToken, messageHandler);
	} else {
		podcasts = await searchByQuery(
			query,
			maxResults,
			accessToken,
			messageHandler,
		);
	}
	return podcasts;
};
