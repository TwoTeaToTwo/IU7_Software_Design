import type { PodcastStream, StreamToolName } from "../types.ts";

export interface IStreamStrategy {
	/**
	 * Return null if can't stream url
	 */
	streamPodcast(url: URL): PodcastStream | null;
	isSupportedURL(url: URL): boolean;
	getStrategyName(): StreamToolName;
}
