import type {
	IStreamStrategy,
	PodcastStream,
	StreamToolName,
} from "@podcast/core";

export class YTDLPStreamStrategy implements IStreamStrategy {
	private readonly ytdlp_cmd_name = "yt-dlp";
	private readonly strategy_name = "yt-dlp";

	public streamPodcast(url: URL): PodcastStream {
		const stream_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: ["-x", "--audio-format", "mp3", url.toString(), "-o", "-"],
			stdout: "piped",
			stderr: "piped",
		});
		const child = stream_cmd.spawn();
		return child.stdout;
	}

	public async isSupportedURL(url: URL): Promise<boolean> {
		const check_cmd = new Deno.Command(this.ytdlp_cmd_name, {
			args: ["-s", "--no-warnings", url.toString()],
			stdout: "piped",
			stderr: "piped",
		});
		const child = check_cmd.spawn();
		const { success } = await child.status;
		return success;
	}

	public getStrategyName(): StreamToolName {
		return this.strategy_name;
	}
}
