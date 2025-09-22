import { migrate } from "drizzle-orm/pglite/migrator";
import type { PostgresLiteDB } from "../mod.ts";
import { databaseConfig } from "../config.ts";
import { users } from "../schema.ts";
import { max } from "drizzle-orm";

export class MigrationHelper {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	async setupTestDb(): Promise<void> {
		await migrate(this.db, {
			migrationsFolder: databaseConfig.migrationFolder,
		});
	}
}

export class UserHelper {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	public async getLastUserId(): Promise<number> {
		const result = await this.db.select({ value: max(users.id) }).from(
			users,
		);
		const record = result[0];
		if (record !== null && record.value !== null) {
			return record.value;
		} else {
			return 1;
		}
	}
}
