import * as log from "@std/log";
import { join } from "@std/path";
import { loggerConfig } from "./config.ts";

export const setupLogger = () => {
	const log_dir = loggerConfig.log_dir_path;
	log.setup({
		handlers: {
			file: new log.RotatingFileHandler("INFO", {
				filename: join(log_dir, "info.log"),
				maxBytes: loggerConfig.maxBytes,
				maxBackupCount: loggerConfig.maxBackupCount,
				formatter: (record) =>
					`${record.datetime} ${record.levelName} ${record.msg}`,
			}),
		},
	});
};
