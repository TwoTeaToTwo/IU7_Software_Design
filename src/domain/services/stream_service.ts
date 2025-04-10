import type { IStreamStrategy } from "../output_ports/i_stream_strategy.ts";
import type { StreamToolName } from "../types.ts";
import { inject, injectable } from "inversify";
import { INJECT_TYPES, type PodcastStream } from "../types.ts";

export class UnsupportableURLError extends Error {
	constructor() {
		super("ERROR: Unknown platform of url");
		Object.setPrototypeOf(this, UnsupportableURLError.prototype);
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
	public streamPodcast(url: URL): PodcastStream {
		const tool_name = this.getToolNameByURL(url);
		if (tool_name === null) {
			throw new UnsupportableURLError();
		} else {
			const streamer = this._stream_strategies.get(tool_name);
			return streamer!.streamPodcast(url);
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
