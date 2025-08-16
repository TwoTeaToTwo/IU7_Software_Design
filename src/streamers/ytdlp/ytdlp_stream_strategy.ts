import type {
	IStreamStrategy,
	PodcastStream,
	StreamToolName,
} from "@podcast/core";

export class YTDLPStreamStrategy implements IStreamStrategy {
	private readonly ytdlp_cmd_name = "yt-dlp";
	private readonly strategy_name = "yt-dlp";

	public streamPodcast(url: URL): PodcastStream | null {
		const stream_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: ["-x", "--audio-format", "mp3", url.toString(), "-o", "-"],
			stdout: "piped",
			stderr: "piped",
		});
		const child = stream_cmd.spawn();
		const cleanUp = async () => {
			child.kill();
			await child.stderr.cancel();
		};
		const stream = child.stdout;
		stream.getReader().closed.finally(cleanUp);
		return child.stdout;
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
