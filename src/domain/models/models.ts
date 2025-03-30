import type { Id, Platform, Url, Password, UInt} from "../types.ts";

export class Podcast {
	constructor(
		private _id: Id,
		private _url: Url,
		private _title: string,
		private _platform: Platform,
		private _duration_seconds: UInt
	) {}
	get id() {
		return this._id;
	}
	get url() {
		return this._url;
	}
	get title() {
		return this._title;
	}
	get platform() {
		return this._platform;
	}
	/** Return duration of podcast in seconds
	 */
	get duration_s() {
		return this._duration_seconds;
	}
}

export class Subscribe {
	constructor(
		private _id: Id,
		private _url: Url,
		private _title: string,
		private _platform: Platform,
	) {}
	get id() {
		return this._id;
	}
	get url() {
		return this._url;
	}
	get title() {
		return this._title;
	}
	get platform() {
		return this._platform;
	}
}

export class User {
	constructor(
		private _id: Id,
		private _login: string,
		private _password: Password
	) {}
	get id() {
		return this._id;
	}
	get login() {
		return this._login;
	}
	get password() {
		return this._password;
	}
}