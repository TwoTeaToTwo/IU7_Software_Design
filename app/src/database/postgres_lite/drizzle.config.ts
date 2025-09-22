import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: `./database/postgres_lite/drizzle`,
	schema: `./database/postgres_lite/schema.ts`,
	dialect: "postgresql",
});
