import {UserRepository, postgresDB, INJECT_TYPES} from "@podcast/database_postgres";
import { User } from "@podcast/domain";
import { Container } from "inversify";

Deno.test("Database: UserRepository: save: positive test: add new user", async () => {
    const test_container = new Container();
    test_container.bind(INJECT_TYPES.NodePgDatabase).toConstantValue(postgresDB);
    test_container.bind(INJECT_TYPES.UserRepository).to(UserRepository);
    const repo = test_container.get<UserRepository>(INJECT_TYPES.UserRepository);
    const user = new User()
});