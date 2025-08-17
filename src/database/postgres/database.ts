import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";

export const createPostgresDB = () => {
	const connectionPool = new Pool({
		connectionString: Deno.env.get("POSTGRES_URL")!,
	});
	const postgresDB = drizzle(connectionPool);
	return postgresDB;
};

export type PostgresDB = ReturnType<typeof createPostgresDB>;
