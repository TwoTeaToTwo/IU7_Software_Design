import type { IStreamStrategy } from "../output_ports/i_stream_strategy.ts";
import type { StreamToolName } from "../types.ts";
import { inject, injectable } from "npm:inversify";
import { INJECT_TYPES, type PodcastStream } from "../types.ts";

export class UnsupportableURLError extends Error {
	constructor() {
		super("ERROR: Unknown platform of url");
		Object.setPrototypeOf(this, UnsupportableURLError.prototype);
	}
}

export class GetStreamerError extends Error {
	constructor(tool_name: StreamToolName) {
		super(`ERROR: can't find implementation for streamer ${tool_name}`);
		Object.setPrototypeOf(this, GetStreamerError.prototype);
	}
}

@injectable()
export class StreamService {
	constructor(
		@inject(INJECT_TYPES.StreamStrategies) private _stream_strategies: Map<
			StreamToolName,
			IStreamStrategy
		>,
	) {}
	/**
	 * throw GetStreamerError if can't find streamer for url
	 */
	public streamPodcast(url: URL): PodcastStream {
		const tool_name = this.getToolNameByURL(url);
		if (tool_name === null) {
			throw new UnsupportableURLError();
		} else {
			const streamer = this._stream_strategies.get(tool_name);
			if (streamer === undefined) {
				throw new GetStreamerError(tool_name);
			} else {
				return streamer.streamPodcast(url);
			}
		}
	}
	public getToolNameByURL(url: URL): StreamToolName | null {
		let tool_name: StreamToolName | null = null;
		for (const streamer of this._stream_strategies) {
			if (streamer[1].isSupportedURL(url)) {
				tool_name = streamer[0];
				break;
			}
		}
		return tool_name;
	}
}
