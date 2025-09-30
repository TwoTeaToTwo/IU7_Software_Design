import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseConfig } from "./config.ts";

export const createPostgresDB = () => {
	const connectionPool = new Pool({
		connectionString: databaseConfig.connectionString,
	});
	const postgresDB = pgDrizzle(connectionPool);
	return postgresDB;
};

export type PostgresDB = ReturnType<typeof createPostgresDB>;
