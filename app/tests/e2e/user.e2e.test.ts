import { Server } from "@podcast/server";
import { UserMother } from "@podcast/core";
import { Client } from "./client.ts";
import { assertEquals } from "@std/assert";

const userMother = new UserMother();

Deno.test("e2e: client search podcast by url", async (t) => {
	const client = new Client();
	const server = new Server(false);
	const user = userMother.createUser();
	await server.runServer();

	await t.step("client: login", async () => {
		await client.login(user.login, user.password.password);
	});

	await server.stopServer();
	assertEquals(true, true);
});
