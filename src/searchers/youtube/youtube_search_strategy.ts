import { createUInt, Podcast } from "@podcast/domain";
import type { ISearchStrategy, SearchPlatform, UInt } from "@podcast/domain";
import { google, type youtube_v3 } from "npm:googleapis";

type ChannelId = { type: "channel" | "user" | "handle"; id: string };

export class YoutubeSearchStrategy implements ISearchStrategy {
	private readonly youtube: youtube_v3.Youtube;
	private readonly platform = "youtube";

	constructor() {
		this.youtube = google.youtube({
			version: "v3",
			auth: Deno.env.get("YOUTUBE_API_KEY"),
		});
	}

	public async searchPodcast(
		query: string,
		max_results: UInt,
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		const search_result = await this.youtube.search.list({
			part: ["snippet"],
			q: query,
			safeSearch: "none",
			type: ["video"],
			videoDefinition: "any",
			videoLicense: "any",
			videoPaidProductPlacement: "any",
			videoSyndicated: "any",
			videoType: "any",
			maxResults: max_results,
		});
		const items = search_result.data.items;
		if (items !== undefined) {
			for (const item of items) {
				const podcast = await this.getPodcastFromSearchResult(item);
				if (podcast) {
					podcasts.push(podcast);
				}
			}
		}
		return podcasts;
	}

	private async getVideoDuration(video_id: string): Promise<UInt | null> {
		let result: UInt | null = null;
		const video_data = await this.getVideoInfo(video_id, [
			"contentDetails",
		]);
		if (
			video_data && video_data.contentDetails &&
			video_data.contentDetails.duration
		) {
			const duration_seconds = new Date(
				video_data.contentDetails.duration,
			).getTime() / 1000;
			result = createUInt(Math.max(1, Math.round(duration_seconds)));
		}
		return result;
	}

	private async getPodcastFromSearchResult(
		item: youtube_v3.Schema$SearchResult,
	): Promise<Podcast | undefined> {
		let podcast: Podcast | undefined;
		if (
			item.id && item.id?.videoId && item.snippet &&
			item.snippet?.title && item.snippet?.publishedAt
		) {
			const url = new URL(
				`https://www.youtube.com/watch?v=${item.id.videoId}`,
			);
			const title = item.snippet.title;
			const duration = await this.getVideoDuration(item.id.videoId);
			if (duration !== null) {
				const relevance = new Date(item.snippet.publishedAt);
				podcast = new Podcast(
					url,
					title,
					this.platform,
					duration,
					relevance,
				);
			}
		}
		return podcast;
	}

	private async getPodcastFromVideo(
		video_id: string,
	): Promise<Podcast | undefined> {
		let podcast: Podcast | undefined;
		const search_result = await this.youtube.videos.list({
			id: [video_id],
			part: ["snippet"],
			maxResults: 1,
		});
		const item = search_result.data.items?.[0];
		if (
			item && item.id && item.snippet && item.snippet.title &&
			item.snippet.publishedAt
		) {
			const url = new URL(
				`https://www.youtube.com/watch?v=${item.id}`,
			);
			const title = item.snippet.title;
			const duration = await this.getVideoDuration(item.id);
			if (duration !== null) {
				const relevance = new Date(item.snippet.publishedAt);
				podcast = new Podcast(
					url,
					title,
					this.platform,
					duration,
					relevance,
				);
			}
		}
		return podcast;
	}

	private async getVideoInfo(
		videoId: string,
		part: string[],
	): Promise<youtube_v3.Schema$Video | undefined> {
		const result = await this.youtube.videos.list({
			id: [videoId],
			part: part,
			maxResults: 1,
		});
		return result.data.items?.[0];
	}

	private getVideoIdFromUrl(url: URL): string | null {
		if (url.hostname === "youtu.be") {
			return url.pathname.slice(1);
		}
		if (url.hostname.includes("youtube.com")) {
			return url.searchParams.get("v");
		}
		return null;
	}

	/**
	 * Return Podcast if can find, else null
	 */
	public async searchByURL(url: URL): Promise<Podcast | null> {
		const id = this.getVideoIdFromUrl(url);
		let podcast: Podcast | null = null;
		if (id !== null) {
			podcast = await this.getPodcastFromVideo(id) ?? null;
		}
		return podcast;
	}

	private getChannelId(url: URL): ChannelId | null {
		const path = url.pathname;
		if (path.startsWith("/channel/")) {
			return { type: "channel", id: path.split("/")[2] };
		} else if (path.startsWith("/user/")) {
			return { type: "user", id: path.split("/")[2] };
		} else if (path.startsWith("/@")) {
			return { type: "handle", id: path.slice(1) };
		}
		return null;
	}

	private async getChannelInfoForChannel(
		channel_id: string,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		const result = await this.youtube.channels.list({
			id: [channel_id],
			part: part,
			maxResults: 1,
		});
		return result.data.items?.[0];
	}

	private async getChannelInfoForUser(
		user_name: string,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		const result = await this.youtube.channels.list({
			forUsername: user_name,
			part: part,
			maxResults: 1,
		});
		return result.data.items?.[0];
	}

	private async getChannelInfoForHandle(
		handle_name: string,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		let channel_data: youtube_v3.Schema$Channel | undefined;
		const handle_result = await this.youtube.search.list({
			q: handle_name,
			type: ["channel"],
			part: ["snippet"],
			maxResults: 1,
		});
		const channel_id = handle_result.data.items?.[0]?.snippet?.channelId;
		if (channel_id !== undefined && channel_id !== null) {
			const channel_result = await this.youtube.channels.list({
				id: [channel_id],
				part: part,
				maxResults: 1,
			});
			channel_data = channel_result.data.items?.[0];
		}
		return channel_data;
	}

	private async getChannelInfo(
		channel_id: ChannelId,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		let channel_info: youtube_v3.Schema$Channel | undefined;
		if (channel_id.type === "channel") {
			channel_info = await this.getChannelInfoForChannel(
				channel_id.id,
				part,
			);
		} else if (channel_id.type === "user") {
			channel_info = await this.getChannelInfoForUser(
				channel_id.id,
				part,
			);
		} else if (channel_id.type === "handle") {
			channel_info = await this.getChannelInfoForHandle(
				channel_id.id,
				part,
			);
		}
		return channel_info;
	}

	/**
	 * Return true if can find channel
	 */
	public async isChannelExist(url: URL): Promise<boolean> {
		const channel_id = this.getChannelId(url);
		let is_exist = false;
		if (channel_id !== null) {
			const part = ["snippet", "statistics"];
			is_exist =
				await this.getChannelInfo(channel_id, part) !== undefined;
		}
		return is_exist;
	}

	/**
	 * Return true if can work with given url
	 */
	public isCorrectURL(url: URL): boolean {
		return this.isCorrectVideoURL(url) && this.isCorrectChannelURL(url);
	}

	private isCorrectVideoURL(url: URL): boolean {
		return this.getVideoIdFromUrl(url) !== null;
	}

	private isCorrectChannelURL(url: URL): boolean {
		return this.getChannelId(url) !== null;
	}

	private async getPodcastsFromPlaylist(
		playlist_id: string,
		count: UInt,
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		const result = await this.youtube.playlistItems.list({
			id: [playlist_id],
			part: ["snippet"],
			maxResults: count,
		});
		const items = result.data.items;
		if (items !== undefined) {
			for (const item of items) {
				const video_id = item.snippet?.resourceId?.videoId;
				if (video_id) {
					const podcast = await this.getPodcastFromVideo(video_id);
					if (podcast) {
						podcasts.push(podcast);
					}
				}
			}
		}
		return podcasts;
	}

	/**
	 * Return null if channel doesn't exist
	 */
	public async getLastPodcastsByChannel(
		channel_url: URL,
		max_results: UInt,
	): Promise<Array<Podcast> | null> {
		let podcasts: Array<Podcast> | null = null;
		const channel_id = this.getChannelId(channel_url);
		if (channel_id !== null) {
			const part = ["contents"];
			const channel_info = await this.getChannelInfo(channel_id, part);
			const uploads_id = channel_info?.contentDetails?.relatedPlaylists
				?.uploads;
			if (uploads_id !== undefined) {
				podcasts = await this.getPodcastsFromPlaylist(
					uploads_id,
					max_results,
				);
			}
		}
		return podcasts;
	}

	public getPlatform(): SearchPlatform {
		return this.platform;
	}
}
