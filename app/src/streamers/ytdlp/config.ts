import { z } from "zod";

const ytdlpConfigSchema = z.object({ cache_path: z.string() });

const loadYTDLPConfig = () => {
	const cache_path = Deno.env.get("YTDLP_CACHE_DIR_PATH");
	if (!cache_path) {
		throw new Error(
			"ERROR: YTDLP_CACHE_DIR_PATH not found in env file",
		);
	}
	const config = { cache_path };
	return ytdlpConfigSchema.parse(config);
};

export const ytdlpConfig = loadYTDLPConfig();
