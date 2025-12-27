import type {
	ISearchStrategy,
	Podcast,
	SearchPlatform,
	Subscribe,
	UInt,
} from "@podcast/core";
import { PodcastMother, SubscribeMother } from "@podcast/tests-utils";

export class InMemorySearchStrategy implements ISearchStrategy {
	private readonly podcasts: Podcast[];
	private readonly channels: Subscribe[];
	private readonly channelPodcasts: Map<string, Podcast[]>;
	private readonly platform = "in-memory";

	constructor() {
		const podcastMother = new PodcastMother();
		const subscribeMother = new SubscribeMother();
		const podcast = podcastMother.createInMemoryPodcast();
		const channel = subscribeMother.createInMemorySubscribe();
		this.podcasts = [podcast];
		this.channels = [channel];
		this.channelPodcasts = new Map<string, Podcast[]>();
		this.channelPodcasts.set(channel.url.toString(), [podcast]);
	}

	public async searchPodcast(
		query: string,
		maxResults: UInt,
	): Promise<Array<Podcast>> {
		await Promise.resolve();
		const podcasts = new Array<Podcast>();
		for (let i = 0; i < maxResults; i++) {
			if (this.podcasts[i].title === query) {
				podcasts.push(this.podcasts[i]);
			}
		}
		return podcasts;
	}

	/**
	 * Return Podcast if can find, else null
	 */
	public async searchByURL(url: URL): Promise<Podcast | null> {
		await Promise.resolve();
		let podcast: Podcast | null = null;
		const podcasts = this.podcasts.filter((podcast) =>
			podcast.url.toString() === url.toString()
		);
		if (podcasts.length > 0) {
			podcast = podcasts[0];
		}
		return podcast;
	}

	/**
	 * Return true if can find channel
	 */
	public async isChannelExist(url: URL): Promise<boolean> {
		await Promise.resolve();
		const channels = this.channels.filter((channel) =>
			channel.url.toString() === url.toString()
		);
		return channels.length > 0;
	}

	/**
	 * Return true if can work with given url
	 */
	public isCorrectURL(url: URL): boolean {
		const channels = this.channels.filter((channel) =>
			channel.url.toString() === url.toString()
		);
		const podcasts = this.podcasts.filter((podcast) =>
			podcast.url.toString() === url.toString()
		);
		return channels.length > 0 || podcasts.length > 0;
	}

	/**
	 * Return null if channel doesn't exist
	 */
	public async getLastPodcastsByChannel(
		channelUrl: URL,
		maxResults: UInt,
	): Promise<Array<Podcast> | null> {
		await Promise.resolve();
		let podcasts: Podcast[] | undefined | null = this.channelPodcasts.get(
			channelUrl.toString(),
		);
		if (podcasts) {
			podcasts = podcasts.slice(0, maxResults);
		} else {
			podcasts = null;
		}
		return podcasts;
	}

	public getPlatform(): SearchPlatform {
		return this.platform;
	}
}
