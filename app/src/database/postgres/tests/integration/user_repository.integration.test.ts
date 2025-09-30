import { type PostgresDB, UserRepository } from "@podcast/database_postgres";
import { assertEquals } from "@std/assert";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { UserMother } from "@podcast/core";
import { databaseConfig } from "../../config.ts";
import { clearUserTableFixture, fillUserTableFixture } from "../fixtures.ts";

const userMother = new UserMother();
let connectionPool: Pool;
let db: PostgresDB;

Deno.test.beforeEach(() => {
	connectionPool = new Pool({
		connectionString: databaseConfig.testConnectionString,
	});
	db = drizzle(connectionPool);
});

Deno.test.afterEach(async () => {
	await clearUserTableFixture(db);
	await connectionPool.end();
});

Deno.test("Database: UserRepository: create: add new user", async () => {
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.create(user.login, user.password);
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: create: add existing user", async () => {
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.create(user.login, user.password);
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findById: record exists", async () => {
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.findById(user.id);
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findById: record doesn't exist", async () => {
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.findById(user.id);
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findByLogin: record exists", async () => {
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.findByLogin(user.login);
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findByLogin: record doesn't exists", async () => {
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.findByLogin(user.login);
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: save: user exist", async () => {
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.save(user);
	assertEquals(result, true);
});

Deno.test("Database: UserRepository: save: user doesn't exist", async () => {
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.save(user);
	assertEquals(result, false);
});

Deno.test("Database: UserRepository: delete: user exists", async () => {
	await fillUserTableFixture(db);
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.delete(user);
	assertEquals(result, true);
});

Deno.test("Database: UserRepository: delete: user doesn't exist", async () => {
	const user = userMother.createUser();
	const userRepository = new UserRepository(db);
	const result = await userRepository.delete(user);
	assertEquals(result, false);
});
