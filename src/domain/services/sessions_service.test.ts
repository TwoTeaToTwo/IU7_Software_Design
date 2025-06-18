import { Container } from "inversify";
import {
	createUInt,
	IncorrectPasswordError,
	INJECT_TYPES,
	Password,
	SessionsService,
	User,
	UserFindError,
} from "../mod.ts";
import type { IUserRepository } from "../mod.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";

Deno.test("SessionsService: isSessionOpened: session isn't opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const result = sessions_service.isSessionOpened(user.id);
	assertEquals(result, false);
});

Deno.test("SessionsService: isSessionOpened: session is opened", async () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	await sessions_service.createSession(user_login, user_password);
	const result = sessions_service.isSessionOpened(user.id);
	assertEquals(result, true);
});

Deno.test("SessionsService: getSessionByUser: session is opened", async () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const session = await sessions_service.createSession(
		user_login,
		user_password,
	);
	const result = sessions_service.getSessionByUserId(user.id);
	assertEquals(result, session);
});

Deno.test("SessionsService: getSessionByUser: session isn't opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const result = sessions_service.getSessionByUserId(user.id);
	assertEquals(result, undefined);
});

Deno.test("SessionsService: createSession: session isn't created", async () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const result = await sessions_service.createSession(
		user_login,
		user_password,
	);
	assertEquals(result.user, user);
});

Deno.test("SessionsService: createSession: session is created", async () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => Promise.resolve(user),
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	sessions_service.createSession(user_login, user_password);
	const result = await sessions_service.createSession(
		user_login,
		user_password,
	);
	assertEquals(result.user, user);
});

Deno.test("SessionsService: createSession: unknown user", async () => {
	const user_login1 = "user";
	const user_password1 = new Password("123");
	const user1 = new User(createUInt(1), user_login1, user_password1);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => {
			if (_user_login === user_login1) {
				return Promise.resolve(user1);
			} else {
				return Promise.resolve(null);
			}
		},
	};
	const user_login2 = "user2";
	const user_password2 = new Password("1234");
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	await sessions_service.createSession(user_login1, user_password1);
	assertRejects(async () => {
		const _result = await sessions_service.createSession(
			user_login2,
			user_password2,
		);
	}, UserFindError);
});

Deno.test("SessionsService: createSession: wrong password", async () => {
	const user_login1 = "user";
	const user_password1 = new Password("123");
	const user1 = new User(createUInt(1), user_login1, user_password1);
	const mock_repo: IUserRepository = {
		delete: (_user) => Promise.resolve(true),
		findById: (_user_id) => Promise.resolve(null),
		save: (_user) => Promise.resolve(true),
		findByLogin: (_user_login: string) => {
			if (_user_login === user_login1) {
				return Promise.resolve(user1);
			} else {
				return Promise.resolve(null);
			}
		},
	};
	const wrong_password = new Password("1234");
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	await sessions_service.createSession(user_login1, user_password1);
	assertRejects(async () => {
		const _result = await sessions_service.createSession(
			user_login1,
			wrong_password,
		);
	}, IncorrectPasswordError);
});
