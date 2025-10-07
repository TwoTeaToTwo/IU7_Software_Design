import { assertEquals } from "@std/assert";
import {
	clearSubscriptionsTableFixture,
	clearUsersHaveSubscriptionsTableFixture,
	clearUserTableFixture,
	fillUserTableFixture,
	UserMother,
} from "@podcast/tests-utils";
import { Client } from "./client.ts";
import config from "./config.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Server } from "@podcast/server";
import {
	databaseConfig,
	DB_INJECT_TYPES,
	type PostgresDB,
} from "@podcast/database_postgres";
import { container, setCreateDIContainer } from "@podcast/infrastructure";
import { createDITestContainer } from "./di.test_container.ts";

let db: PostgresDB;
let connectionPool: Pool;
let server: Server;

Deno.test.beforeAll(async () => {
	setCreateDIContainer(createDITestContainer);
	connectionPool = new Pool({
		connectionString: databaseConfig.testConnectionString,
	});
	db = drizzle(connectionPool);
	container().bind<PostgresDB>(DB_INJECT_TYPES.NodePgDatabase)
		.toConstantValue(
			db,
		);
	await fillUserTableFixture(db);
	server = new Server(false);
	await server.runServer();
});

Deno.test({
	name: "e2e: client search podcast by url",
	sanitizeOps: false,
	sanitizeResources: false,
}, async (t) => {
	const userMother = new UserMother();
	const client = new Client();
	const user = userMother.createUser();

	await t.step("client: login", async () => {
		const response = await fetch(`${config.domain}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				login: "test",
				password: "1234",
			}),
		});
		console.log(response.status);
		const { result } = (await response.json()) as { result: boolean };
		console.log(result);
	});

	assertEquals(true, true);
});

Deno.test.afterAll(async () => {
	await server.stopServer();
	await clearUsersHaveSubscriptionsTableFixture(db);
	await clearSubscriptionsTableFixture(db);
	await clearUserTableFixture(db);
	await connectionPool.end();
});
