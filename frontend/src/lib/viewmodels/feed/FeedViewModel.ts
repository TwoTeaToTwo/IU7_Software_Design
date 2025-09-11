import { durationSecondsToText, PodcastViewModel, relevanceToText } from '../PodcastViewModel.ts';
import { domain } from '../../Config.ts';

export class FeedViewModel {
	public static async getFeedContent(
		feed_size: number,
		access_token: string,
		podcasts: Array<PodcastViewModel>
	): Promise<void> {
		const response = await fetch(`${domain}/api/user/feed/content?feed_size=${feed_size}`, {
			method: 'GET',
			headers: {
				Authorization: access_token,
				'Content-Type': 'application/json'
			}
		});
		const content = (await response.json()) as Array<PodcastViewModel>;
		podcasts.length = 0;
		for (const podcast of content) {
			podcast.durationText = durationSecondsToText(podcast.duration_s);
			podcast.relevanceText = relevanceToText(new Date(podcast.relevance));
			podcasts.push(podcast);
		}
	}
}
