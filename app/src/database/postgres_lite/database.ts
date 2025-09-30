import { drizzle } from "drizzle-orm/pglite";

export const createPostgresLiteDB = () => {
	return drizzle();
};

export type PostgresLiteDB = ReturnType<typeof createPostgresLiteDB>;
