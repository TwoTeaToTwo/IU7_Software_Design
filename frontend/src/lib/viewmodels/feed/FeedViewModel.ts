import { durationSecondsToText, PodcastViewModel, relevanceToText } from '../PodcastViewModel.ts';
import { domain } from '../../Config.ts';
import { errorHandler } from '../../types.ts';

export const getFeedContent = async (
	feed_size: number,
	access_token: string,
	errorHandler: errorHandler
): Promise<Array<PodcastViewModel> | undefined> => {
	try {
		const response = await fetch(`${domain}/api/user/feed/content?feed_size=${feed_size}`, {
			method: 'GET',
			headers: {
				Authorization: access_token,
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			errorHandler("Can't update feed");
		} else {
			const content = (await response.json()) as Array<PodcastViewModel>;
			for (const podcast of content) {
				podcast.durationText = durationSecondsToText(podcast.duration_s);
				podcast.relevanceText = relevanceToText(new Date(podcast.relevance));
			}
			return content;
		}
	} catch {
		errorHandler("Can't update feed");
	}
	return undefined;
};
