import {
	type PostgresLiteDB,
	UserRepository,
} from "@podcast/database_postgres_lite";
import { UserMother } from "@podcast/core";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/pglite";
import { MigrationHelper, UserHelper } from "../helpers.ts";
import { createUInt } from "../../../../core/types.ts";

const userMother = new UserMother();
let db: PostgresLiteDB;
let userHelper: UserHelper;

Deno.test.beforeAll(async () => {
	db = drizzle();
	const migrationHelper = new MigrationHelper(db);
	userHelper = new UserHelper(db);
	await migrationHelper.setupTestDb();
});

Deno.test("Database: UserRepository: create: add new user", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.create(user.login, user.password);

	assertEquals(result, user);
});

Deno.test("Database: UserRepository: create: add existing user", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.create(user.login, user.password);

	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findById: record exists", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.findById(user.id);

	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findById: record doesn't exist", async () => {
	const wrongId = await userHelper.getLastUserId() + 1;
	const user = userMother.createUser({ id: createUInt(wrongId) });
	const userRepository = new UserRepository(db);

	const result = await userRepository.findById(user.id);

	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findByLogin: record exists", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.findByLogin(user.login);

	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findByLogin: record doesn't exists", async () => {
	const user = userMother.createUser({ login: "fake" });
	const userRepository = new UserRepository(db);

	const result = await userRepository.findByLogin(user.login);

	assertEquals(result, null);
});

Deno.test("Database: UserRepository: save: user exist", async () => {
	const user = userMother.createUser({ login: "new" });
	const userRepository = new UserRepository(db);

	const result = await userRepository.save(user);

	assertEquals(result, true);
});

Deno.test("Database: UserRepository: save: user doesn't exist", async () => {
	const wrongId = await userHelper.getLastUserId() + 1;
	const user = userMother.createUser({
		login: "new",
		id: createUInt(wrongId),
	});
	const userRepository = new UserRepository(db);

	const result = await userRepository.save(user);

	assertEquals(result, false);
});

Deno.test("Database: UserRepository: delete: user exists", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.delete(user);

	assertEquals(result, true);
});

Deno.test("Database: UserRepository: delete: user doesn't exist", async () => {
	const user = userMother.createUser({});
	const userRepository = new UserRepository(db);

	const result = await userRepository.delete(user);

	assertEquals(result, false);
});
