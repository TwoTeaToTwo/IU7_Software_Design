import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";
import { databaseConfig } from "./config.ts";

export const createPostgresDB = () => {
	const connectionPool = new Pool({
		connectionString: databaseConfig.connectionString,
	});
	const postgresDB = drizzle(connectionPool);
	return postgresDB;
};

export type PostgresDB = ReturnType<typeof createPostgresDB>;
