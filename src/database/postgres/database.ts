import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";

export const connectionPool = new Pool({
	connectionString: Deno.env.get("POSTGRES_URL")!,
});
export const postgresDB = drizzle(connectionPool);
export type PostgresDB = typeof postgresDB;
