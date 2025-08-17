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
	private readonly ytdlp_cmd_name = "yt-dlp";
	private readonly strategy_name = "yt-dlp";

	public streamPodcast(url: URL): IPodcastStream | null {
		const stream_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: ["-x", "--audio-format", "mp3", url.toString(), "-o", "-"],
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

const q = new YTDLPStreamStrategy();
await q.isSupportedURL(
	new URL("https://youtu.be/GpIq-YDGP5U?si=09whqmj4YaV8h1t6"),
);
