import type { StreamToolName } from "../types.ts";

export interface IPodcastStream {
	getStream(): ReadableStream<Uint8Array<ArrayBuffer>>;
	close(): Promise<void>;
}

export interface IStreamStrategy {
	/**
	 * Return null if can't stream url
	 */
	streamPodcast(url: URL): IPodcastStream | null;
	isSupportedURL(url: URL): Promise<boolean>;
	getStrategyName(): StreamToolName;
}
