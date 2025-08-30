import { z } from "zod";
import { SearchStrategyInitializationError } from "@podcast/core";

const YoutubeConfigSchema = z.object({ api_key: z.string() });

const loadYoutubeConfig = () => {
	const api_key = Deno.env.get("YOUTUBE_API_KEY");
	if (!api_key) {
		throw new SearchStrategyInitializationError(
			"ERROR: YOUTUBE_API_KEY not found in env file",
		);
	}
	const config = { api_key };
	return YoutubeConfigSchema.parse(config);
};

export const youtubeConfig = loadYoutubeConfig();
