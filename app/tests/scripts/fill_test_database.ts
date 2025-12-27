import {
	fillSubscriptionsTableFixture,
	fillUsersHaveSubscriptionsTableFixture,
	fillUserTableFixture,
} from "@podcast/tests-utils";
import { createPostgresDB } from "@podcast/database_postgres";

const db = createPostgresDB();
await fillSubscriptionsTableFixture(db);
await fillUserTableFixture(db);
await fillUsersHaveSubscriptionsTableFixture(db);
