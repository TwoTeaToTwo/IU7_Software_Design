import { z } from "zod";

const databaseConfigSchema = z.object({ connectionString: z.string() });

const loadDatabaseConfig = () => {
	const connectionString = Deno.env.get("POSTGRES_URL");
	if (!connectionString) {
		throw new Error(
			"ERROR: POSTGRES_URL not found in env file",
		);
	}
	const config = { connectionString };
	return databaseConfigSchema.parse(config);
};

export const databaseConfig = loadDatabaseConfig();
