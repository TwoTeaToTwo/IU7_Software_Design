type Stream = ReadableStream<Uint8Array<ArrayBuffer>>;

export interface IStreamStrategy {
	streamPodcast(url: URL): Stream;
}
