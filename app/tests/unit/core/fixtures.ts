import { migrate } from "drizzle-orm/pglite/migrator";
import {
	type PostgresLiteDB,
	UserRepository,
} from "@podcast/database_postgres_lite";
import { UserMother } from "@podcast/tests-utils";

export class DatabaseFixture {
	private readonly db: PostgresLiteDB;

	constructor(db: PostgresLiteDB) {
		this.db = db;
	}

	async setupTestDb(): Promise<void> {
		await migrate(this.db, {
			migrationsFolder: "./src/database/postgres_lite/drizzle",
		});
		const userRepository = new UserRepository(this.db);
		const userMother = new UserMother();
		const user = userMother.createUser();
		await userRepository.create(user.login, user.password);
	}
}
