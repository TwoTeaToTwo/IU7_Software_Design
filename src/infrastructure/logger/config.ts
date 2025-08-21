import { z } from "zod";
import { parse } from "jsr:@std/toml";

const loggerConfigSchema = z.object({
	log_dir_path: z.string(),
	configFile: z.string(),
	maxBytes: z.number().positive(),
	maxBackupCount: z.number().positive(),
});

interface LoggerSection {
	maxBytes: number;
	maxBackupCount: number;
}

type TomlConfig = {
	logger: LoggerSection;
	[key: string]: unknown;
};

const loadLoggerConfig = async () => {
	const log_dir_path = Deno.env.get("LOG_DIR_PATH");
	const configFile = Deno.env.get("CONFIG_FILE");
	if (!configFile) {
		throw Error("ERROR: loadLoggerConfig: not CONFIG_FILE in env file");
	}
	const toml_config = parse(
		await Deno.readTextFile(configFile),
	) as TomlConfig;
	const config = {
		log_dir_path,
		configFile,
		maxBytes: toml_config.logger.maxBytes,
		maxBackupCount: toml_config.logger.maxBackupCount,
	};
	return loggerConfigSchema.parse(config);
};

export const loggerConfig = await loadLoggerConfig();
