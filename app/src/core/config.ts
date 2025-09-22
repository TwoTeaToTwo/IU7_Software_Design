import { z } from "zod";
import { parse } from "@std/toml";

const coreConfigSchema = z.object({
	feedService: z.object({ searchDepth: z.number().positive() }),
});

interface feedServiceSection {
	searchDepth: number;
}

interface TomlConfig {
	feedService: feedServiceSection;
	[key: string]: unknown;
}

const loadCoreConfig = async () => {
	const configFile = Deno.env.get("CONFIG_FILE");
	if (!configFile) {
		throw Error("ERROR: loadCoreConfig: no CONFIG_FILE in env file");
	}
	const toml_config = parse(
		await Deno.readTextFile(configFile),
	) as TomlConfig;
	return coreConfigSchema.parse(toml_config);
};

export const coreConfig = await loadCoreConfig();
