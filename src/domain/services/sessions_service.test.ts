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
import { assertEquals, assertThrows } from "jsr:@std/assert";

Deno.test("SessionsService: isSessionOpened: session isn't opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
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

Deno.test("SessionsService: isSessionOpened: session is opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	sessions_service.createSession(user_login, user_password);
	const result = sessions_service.isSessionOpened(user.id);
	assertEquals(result, true);
});

Deno.test("SessionsService: getSessionByUser: session is opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const session = sessions_service.createSession(user_login, user_password);
	const result = sessions_service.getSessionByUserId(user.id);
	assertEquals(result, session);
});

Deno.test("SessionsService: getSessionByUser: session isn't opened", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
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

Deno.test("SessionsService: createSession: session isn't created", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	const result = sessions_service.createSession(user_login, user_password);
	assertEquals(result.user, user);
});

Deno.test("SessionsService: createSession: session is created", () => {
	const user_login = "user";
	const user_password = new Password("123");
	const user = new User(createUInt(1), user_login, user_password);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => user,
	};
	const test_container = new Container();
	test_container.bind(INJECT_TYPES.UserRepository).toConstantValue(mock_repo);
	test_container.bind(INJECT_TYPES.SessionsService).to(SessionsService);
	const sessions_service = test_container.get<SessionsService>(
		INJECT_TYPES.SessionsService,
	);
	sessions_service.createSession(user_login, user_password);
	const result = sessions_service.createSession(user_login, user_password);
	assertEquals(result.user, user);
});

Deno.test("SessionsService: createSession: unknown user", () => {
	const user_login1 = "user";
	const user_password1 = new Password("123");
	const user1 = new User(createUInt(1), user_login1, user_password1);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => {
			if (_user_login === user_login1) {
				return user1;
			} else {
				return null;
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
	sessions_service.createSession(user_login1, user_password1);
	assertThrows(() => {
		const _result = sessions_service.createSession(
			user_login2,
			user_password2,
		);
	}, UserFindError);
});

Deno.test("SessionsService: createSession: wrong password", () => {
	const user_login1 = "user";
	const user_password1 = new Password("123");
	const user1 = new User(createUInt(1), user_login1, user_password1);
	const mock_repo: IUserRepository = {
		delete: (_user) => true,
		findById: (_user_id) => null,
		save: (_user) => true,
		findByLogin: (_user_login: string) => {
			if (_user_login === user_login1) {
				return user1;
			} else {
				return null;
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
	sessions_service.createSession(user_login1, user_password1);
	assertThrows(() => {
		const _result = sessions_service.createSession(
			user_login1,
			wrong_password,
		);
	}, IncorrectPasswordError);
});
