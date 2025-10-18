import { createUInt, Podcast, SearchError } from "@podcast/core";
import type {
	GetPodcastsOptions,
	ISearchStrategy,
	SearchPlatform,
} from "@podcast/core";
import { parse, toSeconds } from "iso8601-duration";
import type { youtube_v3 } from "googleapis";
import { youtubeConfig } from "./config.ts";

type ChannelId = { type: "channel" | "user" | "handle"; id: string };

interface QueryPageToken {
	query: string;
	pageToken: string;
}

export class YoutubeSearchStrategy implements ISearchStrategy {
	private readonly api_key: string;
	private readonly platform = "youtube";
	private readonly youtube_api_url = "https://www.googleapis.com/youtube/v3";
	private readonly playlistsPageTokens: Map<number, Map<string, string>>;
	private readonly podcastsPageTokens: Map<number, QueryPageToken>;

	constructor() {
		this.api_key = youtubeConfig.api_key;
		this.playlistsPageTokens = new Map<number, Map<string, string>>();
		this.podcastsPageTokens = new Map<number, QueryPageToken>();
	}

	public async searchPodcast(
		userId: number,
		query: string,
		options: GetPodcastsOptions,
	): Promise<Array<Podcast>> {
		const podcasts: Podcast[] = [];
		const { page, podcastsPerPage } = options.pagination;
		const maxResults = Math.min(podcastsPerPage, 50);
		let pageToken = "";
		if (page > 1) {
			const queryPageToken = this.podcastsPageTokens.get(userId);
			if (queryPageToken?.query === query) {
				pageToken = queryPageToken?.pageToken ?? "";
			}
		} else {
			this.podcastsPageTokens.delete(userId);
		}
		const url = new URL(`${this.youtube_api_url}/search`);
		url.searchParams.set("part", "snippet");
		url.searchParams.set("q", query);
		url.searchParams.set("safeSearch", "none");
		url.searchParams.set("type", "video");
		url.searchParams.set("maxResults", maxResults.toString());
		url.searchParams.set("key", this.api_key);
		if (pageToken) url.searchParams.set("pageToken", pageToken);
		const res = await fetch(url);
		if (!res.ok) {
			throw new SearchError(
				`YouTube API failed: ${res.status} for response: ${url}`,
			);
		}
		const data = await res.json();
		if (data.nextPageToken) {
			this.podcastsPageTokens.set(userId, {
				query: query,
				pageToken: data.nextPageToken,
			});
		}
		const searchItems = data.items as
			| youtube_v3.Schema$SearchResult[]
			| undefined;
		if (!searchItems?.length) return [];
		const videoIds = searchItems
			.map((item) => item?.id?.videoId)
			.filter((id): id is string => Boolean(id));
		if (videoIds.length === 0) return [];
		const videos = await this.getVideosBatch(videoIds);
		for (const video of videos) {
			const podcast = this.convertVideoToPodcast(video);
			if (podcast) podcasts.push(podcast);
		}
		return podcasts;
	}

	private async getVideosBatch(
		videoIds: string[],
	): Promise<youtube_v3.Schema$Video[]> {
		const url = new URL(`${this.youtube_api_url}/videos`);
		url.searchParams.set("part", "snippet,contentDetails");
		url.searchParams.set("id", videoIds.join(","));
		url.searchParams.set("key", this.api_key);
		const res = await fetch(url);
		if (!res.ok) {
			throw new SearchError(
				`YouTube API failed: ${res.status} for response: ${url}`,
			);
		}
		const data = await res.json();
		return (data.items as youtube_v3.Schema$Video[]) || [];
	}

	private convertVideoToPodcast(
		item: youtube_v3.Schema$Video,
	): Podcast | undefined {
		if (!item?.id || !item.snippet?.title || !item.snippet.publishedAt) {
			return;
		}
		const url = new URL(`https://www.youtube.com/watch?v=${item.id}`);
		const title = item.snippet.title;
		const isoDuration = item.contentDetails?.duration;
		if (!isoDuration) return;
		const durationObj = parse(isoDuration);
		const durationSeconds = toSeconds(durationObj);
		const duration = createUInt(Math.max(1, Math.round(durationSeconds)));
		const relevance = new Date(item.snippet.publishedAt);
		return new Podcast(url, title, this.platform, duration, relevance);
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
			const videos = await this.getVideosBatch([id]);
			if (videos.length > 0) {
				podcast = this.convertVideoToPodcast(videos[0]) ?? null;
			} else {
				podcast = null;
			}
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
		const url = `${this.youtube_api_url}/channels?part=${part.join(",")}` +
			`&id=${channel_id}` +
			`&maxResults=1` +
			`&key=${this.api_key}`;
		const result = await fetch(url);
		if (!result.ok) {
			throw new SearchError(
				`YouTube API failed: ${result.status} for response: ${url}`,
			);
		}
		const data = await result.json();
		const items = data.items as
			| youtube_v3.Schema$Channel[]
			| undefined;
		return items?.[0];
	}

	private async getChannelInfoForUser(
		user_name: string,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		const url = new URL(`${this.youtube_api_url}/channels`);
		url.searchParams.set("part", part.join(","));
		url.searchParams.set("forUsername", user_name);
		url.searchParams.set("maxResults", "1");
		url.searchParams.set("key", this.api_key);
		const result = await fetch(url);
		if (!result.ok) {
			throw new SearchError(
				`YouTube API failed: ${result.status} for response: ${url}`,
			);
		}
		const data = await result.json();
		const items: youtube_v3.Schema$Channel[] | undefined = data.items;
		return items?.[0];
	}

	private async getChannelInfoForHandle(
		handle_name: string,
		part: string[],
	): Promise<youtube_v3.Schema$Channel | undefined> {
		let channel_data: youtube_v3.Schema$Channel | undefined;
		const handle_url = new URL(`${this.youtube_api_url}/search`);
		handle_url.searchParams.set("part", "snippet");
		handle_url.searchParams.set("type", "channel");
		handle_url.searchParams.set("q", handle_name);
		handle_url.searchParams.set("maxResults", "1");
		handle_url.searchParams.set("key", this.api_key);
		const handle_result = await fetch(handle_url);
		if (!handle_result.ok) {
			throw new SearchError(
				`YouTube API failed: ${handle_result.status} for response: ${handle_url}`,
			);
		}
		const handle_data = await handle_result.json();
		const handle_items: youtube_v3.Schema$SearchResult[] | undefined =
			handle_data.items;
		const channel_id = handle_items?.[0]?.snippet?.channelId;
		if (channel_id) {
			channel_data = await this.getChannelInfoForChannel(
				channel_id,
				part,
			);
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
		return this.isCorrectVideoURL(url) || this.isCorrectChannelURL(url);
	}

	private isCorrectVideoURL(url: URL): boolean {
		return this.getVideoIdFromUrl(url) !== null;
	}

	private isCorrectChannelURL(url: URL): boolean {
		return this.getChannelId(url) !== null;
	}

	private async getPodcastsFromPlaylist(
		userId: number,
		playlist_id: string,
		options: GetPodcastsOptions,
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		if (options.pagination.page === createUInt(1)) {
			this.playlistsPageTokens.get(userId)?.delete(playlist_id);
		}
		const url = new URL(`${this.youtube_api_url}/playlistItems`);
		url.searchParams.set("part", "snippet");
		url.searchParams.set("playlistId", playlist_id);
		url.searchParams.set(
			"maxResults",
			options.pagination.podcastsPerPage.toString(),
		);
		url.searchParams.set("key", this.api_key);
		if (this.playlistsPageTokens.get(userId)?.has(playlist_id)) {
			url.searchParams.set(
				"pageToken",
				this.playlistsPageTokens.get(userId)?.get(playlist_id)!,
			);
		}
		const result = await fetch(url);
		if (!result.ok) {
			throw new SearchError(
				`YouTube API failed: ${result.status} for response: ${url}`,
			);
		}
		const data = await result.json();
		const pageToken = data.nextPageToken as string;
		if (!this.playlistsPageTokens.has(userId)) {
			this.playlistsPageTokens.set(userId, new Map());
		}
		this.playlistsPageTokens.get(userId)?.set(playlist_id, pageToken);
		const items: youtube_v3.Schema$PlaylistItem[] | undefined = data.items;
		const videoIds: string[] = [];
		if (items !== undefined) {
			for (const item of items) {
				const video_id = item.snippet?.resourceId?.videoId;
				if (video_id) {
					videoIds.push(video_id);
				}
			}
		}
		const videos = await this.getVideosBatch(videoIds);
		for (const video of videos) {
			const podcast = this.convertVideoToPodcast(video);
			if (podcast) podcasts.push(podcast);
		}
		return podcasts;
	}

	/**
	 * Return null if channel doesn't exist
	 */
	public async getLastPodcastsByChannel(
		userId: number,
		channel_url: URL,
		options: GetPodcastsOptions,
	): Promise<Array<Podcast> | null> {
		let podcasts: Array<Podcast> | null = null;
		const channel_id = this.getChannelId(channel_url);
		if (channel_id !== null) {
			const part = ["contentDetails"];
			const channel_info = await this.getChannelInfo(channel_id, part);
			const uploads_id = channel_info?.contentDetails?.relatedPlaylists
				?.uploads;
			if (uploads_id !== undefined) {
				podcasts = await this.getPodcastsFromPlaylist(
					userId,
					uploads_id,
					options,
				);
			}
		}
		return podcasts;
	}

	public getPlatform(): SearchPlatform {
		return this.platform;
	}
}
