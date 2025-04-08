import { Session } from "../models/session.ts";
import type { User } from "../models/user.ts";
import type { Id } from "../types.ts";

export class SessionsService {
	private sessions: Array<Session> = new Array<Session>();

	constructor() {}
	public isSessionOpened(user_id: Id) {
		for (const session of this.sessions) {
			if (session.id === user_id) {
				return true;
			}
		}
		return false;
	}
	public createSession(user: User) {
		if (!this.isSessionOpened(user.id)) {
			this.sessions.push(new Session(user));
		}
	}
}
