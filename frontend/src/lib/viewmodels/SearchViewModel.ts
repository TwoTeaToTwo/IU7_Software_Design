import {
	durationSecondsToText,
	type PodcastViewModel,
	relevanceToText
} from './PodcastViewModel.ts';
import type { messageHandler } from '../types.ts';
import { domain } from '../Config.ts';

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
	messageHandler: messageHandler
): Promise<Array<PodcastViewModel> | undefined> => {
	try {
		const responseURL = `${domain}/api/search/by-query?query=${query}&max_results=${maxResults}`;
		const response = await fetch(responseURL, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			messageHandler("Can't find podcasts", 'ERROR');
		} else {
			const content = (await response.json()) as Array<PodcastViewModel>;
			for (const podcast of content) {
				podcast.durationText = durationSecondsToText(podcast.duration_s);
				podcast.relevanceText = relevanceToText(new Date(podcast.relevance));
			}
			messageHandler('Podcasts has founded', 'SEARCH');
			return content;
		}
	} catch {
		messageHandler("Can't find podcasts", 'ERROR');
	}
	return undefined;
};

const searchByUrl = async (
	url: string,
	accessToken: string,
	messageHandler: messageHandler
): Promise<Array<PodcastViewModel> | undefined> => {
	try {
		const responseURL = `${domain}/api/search/by-url?url=${url}`;
		const response = await fetch(responseURL, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			messageHandler("Can't find podcast", 'ERROR');
		} else {
			const podcast = (await response.json()) as PodcastViewModel;
			podcast.durationText = durationSecondsToText(podcast.duration_s);
			podcast.relevanceText = relevanceToText(new Date(podcast.relevance));
			messageHandler('Podcasts has founded', 'SEARCH');
			const podcasts = new Array<PodcastViewModel>();
			podcasts.push(podcast);
			return podcasts;
		}
	} catch {
		messageHandler("Can't find podcast", 'ERROR');
	}
	return undefined;
};

export const searchPodcast = async (
	query: string,
	maxResults: number,
	accessToken: string,
	messageHandler: messageHandler
): Promise<Array<PodcastViewModel> | undefined> => {
	let podcasts: Array<PodcastViewModel> | undefined;
	if (isUrl(query)) {
		podcasts = await searchByUrl(query, accessToken, messageHandler);
	} else {
		podcasts = await searchByQuery(query, maxResults, accessToken, messageHandler);
	}
	return podcasts;
};
