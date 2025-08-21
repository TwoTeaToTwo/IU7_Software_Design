import * as log from "@std/log";
import { join } from "@std/path";
import { loggerConfig } from "./config.ts";

const setupLogger = () => {
	const log_dir = loggerConfig.log_dir_path;
	log.setup({
		handlers: {
			file: new log.RotatingFileHandler("INFO", {
				filename: join(log_dir, "global.log"),
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

export const globalLogger = setupLogger();
