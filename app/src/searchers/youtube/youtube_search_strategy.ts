import { createUInt, Podcast, SearchError } from "@podcast/core";
import type { ISearchStrategy, SearchPlatform, UInt } from "@podcast/core";
import { parse, toSeconds } from "iso8601-duration";
import type { youtube_v3 } from "googleapis";
import { youtubeConfig } from "./config.ts";

type ChannelId = { type: "channel" | "user" | "handle"; id: string };

export class YoutubeSearchStrategy implements ISearchStrategy {
	private readonly api_key: string;
	private readonly platform = "youtube";
	private readonly youtube_api_url = "https://www.googleapis.com/youtube/v3";

	constructor() {
		this.api_key = youtubeConfig.api_key;
	}

	public async searchPodcast(
		query: string,
		max_results: UInt,
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		const url = new URL(`${this.youtube_api_url}/search`);
		url.searchParams.set("part", "snippet");
		url.searchParams.set("q", query);
		url.searchParams.set("safeSearch", "none");
		url.searchParams.set("type", "video");
		url.searchParams.set("maxResults", max_results.toString());
		url.searchParams.set("key", this.api_key);
		const search_result = await fetch(url);
		if (!search_result.ok) {
			throw new SearchError(
				`YouTube API failed: ${search_result.status} for response: ${url}`,
			);
		}
		const data = await search_result.json();
		const items = data.items as
			| youtube_v3.Schema$SearchResult[]
			| undefined;
		if (items !== undefined) {
			for (const item of items) {
				const video_id = item?.id?.videoId;
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

	private async getVideoDuration(video_id: string): Promise<UInt | null> {
		let result: UInt | null = null;
		const video_data = await this.getVideoInfo(video_id, [
			"contentDetails",
		]);
		const video_duration = video_data?.contentDetails?.duration;
		if (video_duration) {
			const duration_obj = parse(video_duration);
			const duration_seconds = toSeconds(duration_obj);
			result = createUInt(Math.max(1, Math.round(duration_seconds)));
		}
		return result;
	}

	private async getPodcastFromVideo(
		video_id: string,
	): Promise<Podcast | undefined> {
		let podcast: Podcast | undefined;
		const url = `${this.youtube_api_url}/videos?part=snippet` +
			`&id=${video_id}` +
			`&key=${this.api_key}`;
		const search_result = await fetch(url);
		if (!search_result.ok) {
			throw new SearchError(
				`YouTube API failed: ${search_result.status} for response: ${url}`,
			);
		}
		const data = await search_result.json();
		const items = data.items as
			| youtube_v3.Schema$Video[]
			| undefined;
		const item = items?.[0];
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
		video_id: string,
		part: string[],
	): Promise<youtube_v3.Schema$Video | undefined> {
		const url = `${this.youtube_api_url}/videos?part=${part.join(",")}` +
			`&id=${video_id}` +
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
			| youtube_v3.Schema$Video[]
			| undefined;
		const item = items?.[0];
		return item;
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
		playlist_id: string,
		count: UInt,
	): Promise<Array<Podcast>> {
		const podcasts = new Array<Podcast>();
		const url = new URL(`${this.youtube_api_url}/playlistItems`);
		url.searchParams.set("part", "snippet");
		url.searchParams.set("playlistId", playlist_id);
		url.searchParams.set("maxResults", count.toString());
		url.searchParams.set("key", this.api_key);
		const result = await fetch(url);
		if (!result.ok) {
			throw new SearchError(
				`YouTube API failed: ${result.status} for response: ${url}`,
			);
		}
		const data = await result.json();
		const items: youtube_v3.Schema$PlaylistItem[] | undefined = data.items;
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
			const part = ["contentDetails"];
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
