import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "./config.ts";

export default defineConfig({
	out: `./src/database/postgres/drizzle`,
	schema: `./src/database/postgres/schema.ts`,
	dialect: "postgresql",
	dbCredentials: {
		url: databaseConfig.connectionString,
	},
});
