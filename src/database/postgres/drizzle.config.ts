import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: `${Deno.env.get("POSTGRES_COMPONENT_FOLDER")!}/drizzle`,
	schema: `${Deno.env.get("POSTGRES_COMPONENT_FOLDER")!}/schema.ts`,
	dialect: "postgresql",
	dbCredentials: {
		url: Deno.env.get("POSTGRES_URL")!,
	},
});
