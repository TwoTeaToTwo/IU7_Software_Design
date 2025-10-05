import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "@podcast/database_postgres";

export default defineConfig({
	out: `./database/postgres/drizzle`,
	schema: `./database/postgres/schema.ts`,
	dialect: "postgresql",
	dbCredentials: {
		url: databaseConfig.testConnectionString,
	},
});
