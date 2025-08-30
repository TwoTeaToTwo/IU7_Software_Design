import * as log from "@std/log";
import { join } from "@std/path";
import { loggerConfig } from "./config.ts";

const setupLogger = async () => {
	const logDir = loggerConfig.logDirPath;
	try {
		await Deno.lstat(logDir);
	} catch (_) {
		await Deno.mkdir(logDir);
	}
	log.setup({
		handlers: {
			file: new log.RotatingFileHandler("INFO", {
				filename: join(logDir, "global.log"),
				maxBytes: loggerConfig.maxBytes,
				maxBackupCount: loggerConfig.maxBackupCount,
				formatter: (record) =>
					`${record.datetime} ${record.levelName} ${record.msg}`,
			}),
		},
		loggers: {
			global: {
				level: "INFO",
				handlers: ["file"],
			},
		},
	});
	return log.getLogger("global");
};

export const globalLogger = await setupLogger();
