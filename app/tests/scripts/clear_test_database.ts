import {
	clearSubscriptionsTableFixture,
	clearUsersHaveSubscriptionsTableFixture,
	clearUserTableFixture,
} from "@podcast/tests-utils";
import { createPostgresDB } from "@podcast/database_postgres";

const db = createPostgresDB();
await clearUsersHaveSubscriptionsTableFixture(db);
await clearUserTableFixture(db);
await clearSubscriptionsTableFixture(db);
