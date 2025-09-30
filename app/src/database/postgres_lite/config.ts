import { z } from "zod";
import * as path from "@std/path";

const databaseConfigSchema = z.object({ migrationFolder: z.string() });

const loadDatabaseConfig = () => {
	const migrationFolder = path.resolve("./database/postgres_lite/drizzle");
	console.log(migrationFolder);
	const config = { migrationFolder };
	return databaseConfigSchema.parse(config);
};

export const databaseConfig = loadDatabaseConfig();
