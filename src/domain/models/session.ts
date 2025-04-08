import { Feed } from "./feed.ts";
import type { User } from "./user.ts";

export class Session {
	private _feed: Feed;
	constructor(private _user: User) {
		this._feed = new Feed(this._user.id);
	}
	get feed() {
		return this._feed;
	}
	get id() {
		return this._user.id;
	}
}
