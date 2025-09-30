import { migrate } from "drizzle-orm/pglite/migrator";
import type { PostgresLiteDB } from "../mod.ts";
import { databaseConfig } from "../config.ts";

export class DatabaseFixture {
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
