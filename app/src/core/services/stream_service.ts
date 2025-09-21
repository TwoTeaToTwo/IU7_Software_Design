import type {
	IPodcastStream,
	IStreamStrategy,
} from "../output_ports/i_stream_strategy.ts";
import type { StreamToolName } from "../types.ts";
import { inject, injectable } from "inversify";
import { INJECT_TYPES } from "../types.ts";

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

export class PodcastStreamError extends Error {
	constructor() {
		super(`ERROR: can't stream`);
		Object.setPrototypeOf(this, PodcastStreamError.prototype);
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
	 *
	 * throw PodcastStreamError if can't stream podcast
	 */
	public async streamPodcast(url: URL): Promise<IPodcastStream> {
		const tool_name = await this.getToolNameByURL(url);
		if (tool_name === null) {
			throw new UnsupportableURLError();
		} else {
			const streamer = this._stream_strategies.get(tool_name);
			if (streamer === undefined) {
				throw new GetStreamerError(tool_name);
			} else {
				const stream = streamer.streamPodcast(url);
				if (stream === null) {
					throw new PodcastStreamError();
				} else {
					return stream;
				}
			}
		}
	}
	public async getToolNameByURL(url: URL): Promise<StreamToolName | null> {
		let tool_name: StreamToolName | null = null;
		for (const streamer of this._stream_strategies) {
			if (await streamer[1].isSupportedURL(url)) {
				tool_name = streamer[0];
				break;
			}
		}
		return tool_name;
	}
}
