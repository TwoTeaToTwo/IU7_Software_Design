import { drizzle as pgLiteDrizzle } from "drizzle-orm/pglite";

export const createPostgresLiteDB = () => {
	return pgLiteDrizzle();
};

export type PostgresLiteDB = ReturnType<typeof createPostgresLiteDB>;
