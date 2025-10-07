import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Server } from "@podcast/server";
import {
	databaseConfig,
	DB_INJECT_TYPES,
	type PostgresDB,
} from "@podcast/database_postgres";
import { setCreateDIContainer } from "@podcast/infrastructure";
import { createDITestContainer } from "./di.test_container.ts";
setCreateDIContainer(createDITestContainer);
import { container } from "@podcast/infrastructure";
const connectionPool = new Pool({
	connectionString: databaseConfig.testConnectionString,
});
const db = drizzle(connectionPool);
container().bind<PostgresDB>(DB_INJECT_TYPES.NodePgDatabase).toConstantValue(
	db,
);
// fill database with data
const server = new Server(true);
await server.runServer();
console.log("Server started");
await new Promise(() => {});
console.log("Server died");
// clear database with
