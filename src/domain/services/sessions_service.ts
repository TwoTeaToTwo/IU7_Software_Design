import { Session } from "../models/session.ts";
import type { Password } from "../models/user.ts";
import { type Id, INJECT_TYPES } from "../types.ts";
import type { IUserRepository } from "../output_ports/i_user_repository.ts";
import { inject, injectable } from "npm:inversify";
import { UserFindError } from "./errors.ts";

export class IncorrectPasswordError extends Error {
	constructor() {
		super("ERROR: incorrect password");
		Object.setPrototypeOf(this, IncorrectPasswordError.prototype);
	}
}

@injectable()
export class SessionsService {
	private _sessions: Array<Session> = new Array<Session>();

	constructor(
		@inject(INJECT_TYPES.UserRepository) private _user_repo:
			IUserRepository,
	) {}
	public isSessionOpened(user_id: Id) {
		for (const session of this._sessions) {
			if (session.user.id == user_id) {
				return true;
			}
		}
		return false;
	}
	public getSessionByUserId(user_id: Id) {
		const session = this._sessions.find((value, _index, _) =>
			value.user.id === user_id
		);
		return session;
	}
	/**
	 * throw UserFindError if can't find user in database
	 * throw IncorrectLoginError if login is incorrect
	 */
	public createSession(user_login: string, user_password: Password): Session {
		const rep_user = this._user_repo.findByLogin(user_login);
		if (rep_user === null) {
			throw new UserFindError();
		} else {
			if (rep_user.password !== user_password) {
				throw new IncorrectPasswordError();
			} else {
				if (!this.isSessionOpened(rep_user.id)) {
					this._sessions.push(new Session(rep_user));
				}
				return this.getSessionByUserId(rep_user.id)!;
			}
		}
	}
}
