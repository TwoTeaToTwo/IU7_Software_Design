import type {
	IPodcastStream,
	IStreamStrategy,
	StreamToolName,
} from "@podcast/core";

class YTDLPPodcastStream implements IPodcastStream {
	constructor(private _stream_process: Deno.ChildProcess) {
	}
	public getStream(): ReadableStream<Uint8Array<ArrayBuffer>> {
		return this._stream_process.stdout;
	}
	public async close(): Promise<void> {
		this._stream_process.kill();
		await this._stream_process.stderr.cancel();
		await this._stream_process.stdout.cancel();
	}
}

export class YTDLPStreamStrategy implements IStreamStrategy {
	private readonly cache_path: string;
	private readonly ytdlp_cmd_name = "yt-dlp";
	private readonly strategy_name = "yt-dlp";

	constructor() {
		const cache_path = Deno.env.get("YTDLP_CACHE_DIR_PATH");
		if (cache_path) {
			this.cache_path = cache_path;
		} else {
			throw new Error(
				"ERROR: YTDLP_CACHE_DIR_PATH not found in env file",
			);
		}
	}

	public streamPodcast(url: URL): IPodcastStream | null {
		const stream_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: [
				"-x",
				"--audio-format",
				"mp3",
				"--cache-dir",
				this.cache_path,
				url.toString(),
				"-o",
				"-",
			],
			stdout: "piped",
			stderr: "piped",
		});
		const child = stream_cmd.spawn();
		const stream = new YTDLPPodcastStream(child);
		return stream;
	}

	public async isSupportedURL(url: URL): Promise<boolean> {
		const check_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: [
				"-s",
				"--no-warnings",
				"--no-check-formats",
				"--no-download",
				"--no-check-certificate",
				"--flat-playlist",
				"--cache-dir",
				this.cache_path,
				url.toString(),
			],
			stdout: "piped",
			stderr: "piped",
		});
		const child = check_cmd.spawn();
		const { success } = await child.status;
		await child.stderr.cancel();
		await child.stdout.cancel();
		return success;
	}

	public getStrategyName(): StreamToolName {
		return this.strategy_name;
	}
}
