import { z } from "zod";
import { parse } from "jsr:@std/toml";
import { resolve } from "jsr:@std/path";

const loggerConfigSchema = z.object({
	logDirPath: z.string(),
	maxBytes: z.number().positive(),
	maxBackupCount: z.number().positive(),
});

interface LoggerSection {
	maxBytes: number;
	maxBackupCount: number;
}

interface TomlConfig {
	logger: LoggerSection;
	[key: string]: unknown;
}

const loadLoggerConfig = async () => {
	const logDirPath = Deno.env.get("LOG_DIR_PATH");
	const configFile = Deno.env.get("CONFIG_FILE");
	if (!configFile) {
		throw Error("ERROR: loadLoggerConfig: no CONFIG_FILE in env file");
	}
	const toml_config = parse(
		await Deno.readTextFile(resolve(configFile)),
	) as TomlConfig;
	const config = {
		logDirPath,
		maxBytes: toml_config.logger.maxBytes,
		maxBackupCount: toml_config.logger.maxBackupCount,
	};
	return loggerConfigSchema.parse(config);
};

export const loggerConfig = await loadLoggerConfig();
