import {
	INJECT_TYPES,
	type PostgresDB,
	UserRepository,
} from "@podcast/database_postgres";
import { users } from "../../schema.ts";
import { createUInt, User } from "@podcast/domain";
import { Container } from "inversify";
import { Password } from "../../../../domain/models/user.ts";
import { assertEquals } from "jsr:@std/assert";
import { max } from "npm:drizzle-orm";
import { drizzle } from "npm:drizzle-orm/node-postgres";
import { Pool } from "npm:pg";

async function getLastUserId(db: PostgresDB): Promise<number> {
	const result = await db.select({ value: max(users.id) }).from(
		users,
	);
	const record = result[0];
	if (record !== null && record.value !== null) {
		return record.value;
	} else {
		return 1;
	}
}

Deno.test("Database: UserRepository: create: add new user", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const login = "test";
	const password = new Password("test");
	const result = await repo.create(login, password);
	const user = new User(createUInt(await getLastUserId(db)), login, password);
	await pool.end();
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: create: add existing user", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const login = "test";
	const password = new Password("test");
	const result = await repo.create(login, password);
	await pool.end();
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findById: record exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db));
	const login = "test";
	const password = new Password("test");
	const result = await repo.findById(user_id);
	const user = new User(user_id, login, password);
	await pool.end();
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findById: record doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db) + 1);
	const result = await repo.findById(user_id);
	await pool.end();
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: findByLogin: record exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db));
	const login = "test";
	const password = new Password("test");
	const result = await repo.findByLogin(login);
	const user = new User(user_id, login, password);
	await pool.end();
	assertEquals(result, user);
});

Deno.test("Database: UserRepository: findByLogin: record doesn't exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const login = "1234";
	const result = await repo.findByLogin(login);
	await pool.end();
	assertEquals(result, null);
});

Deno.test("Database: UserRepository: save: user exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db));
	const login = "new_login";
	const password = new Password("new_password");
	const user = new User(user_id, login, password);
	const result = await repo.save(user);
	await pool.end();
	assertEquals(result, true);
});

Deno.test("Database: UserRepository: save: user doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db) + 1);
	const login = "test";
	const password = new Password("new_password");
	const user = new User(user_id, login, password);
	const result = await repo.save(user);
	await pool.end();
	assertEquals(result, false);
});

Deno.test("Database: UserRepository: delete: user exists", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db));
	const login = "new_login";
	const password = new Password("new_password");
	const user = new User(user_id, login, password);
	const result = await repo.delete(user);
	await pool.end();
	assertEquals(result, true);
});

Deno.test("Database: UserRepository: delete: user doesn't exist", async () => {
	const test_container = new Container();
	const pool = new Pool({ connectionString: Deno.env.get("POSTGRES_URL")! });
	const db = drizzle(pool);
	test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(
		db,
	);
	test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
	const repo = test_container.get<UserRepository>(
		INJECT_TYPES.UserRepository,
	);
	const user_id = createUInt(await getLastUserId(db) + 1);
	const login = "new_login";
	const password = new Password("new_password");
	const user = new User(user_id, login, password);
	const result = await repo.delete(user);
	await pool.end();
	assertEquals(result, false);
});
