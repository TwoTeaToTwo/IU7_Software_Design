import type { PostgresDB } from "../mod.ts";
import { users } from "../schema.ts";
import { sql } from "drizzle-orm";
import { UserMother } from "@podcast/core";

export const clearUserTableFixture = async (db: PostgresDB): Promise<void> => {
	// await db.delete(users);
	await db.execute(
		sql`TRUNCATE TABLE ${sql.raw("users")} RESTART IDENTITY CASCADE`,
	);
};

export const fillUserTableFixture = async (db: PostgresDB): Promise<void> => {
	const userMother = new UserMother();
	const user = userMother.createUser();
	await db.insert(users).values({
		login: user.login,
		password: user.password.password,
	});
};
