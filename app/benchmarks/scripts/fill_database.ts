import type { PostgresDB } from "@podcast/database_postgres";
import { createUInt, Password, User } from "@podcast/core";
import { databaseConfig, users } from "@podcast/database_postgres";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const userCount = 1000;
const password = new Password("1234");
const connectionPool: Pool = new Pool({
	connectionString: databaseConfig.connectionString,
});
const db: PostgresDB = drizzle(connectionPool);

const clearUserTableFixture = async (db: PostgresDB): Promise<void> => {
	await db.execute(
		sql`TRUNCATE TABLE ${sql.raw("users")} RESTART IDENTITY CASCADE`,
	);
};

const createUser = (login: number): User => {
	return new User(createUInt(login), login.toString(), password);
};

const fillUserTableFixture = async (db: PostgresDB): Promise<void> => {
	for (let i = 0; i < userCount; i++) {
		const user = createUser(i);
		await db.insert(users).values({
			id: user.id,
			login: user.login,
			password: user.password.password,
		});
	}
};

const main = async (): Promise<void> => {
	await clearUserTableFixture(db);
	await fillUserTableFixture(db);
};

main();
