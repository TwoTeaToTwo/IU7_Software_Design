import { migrate } from "drizzle-orm/pglite/migrator";
import {
	databaseConfig,
	type PostgresLiteDB,
} from "@podcast/database_postgres_lite";

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
