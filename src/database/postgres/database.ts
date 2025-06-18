import { drizzle } from "npm:drizzle-orm/node-postgres";

export const postgresDB = drizzle(Deno.env.get("POSTGRES_URL")!);
export type PostgresDB = typeof postgresDB;