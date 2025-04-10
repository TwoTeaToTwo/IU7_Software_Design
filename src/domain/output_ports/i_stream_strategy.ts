import type { PodcastStream, StreamToolName } from "../types.ts";

export interface IStreamStrategy {
	streamPodcast(url: URL): PodcastStream;
	isSupportedURL(url: URL): boolean;
	getStrategyName(): StreamToolName;
}
