import { pipeline } from "zod";
import type { Id, Password, Platform, UInt, Url } from "../types.ts";

export class Podcast {
	constructor(
		private _id: Id,
		private _url: Url,
		private _title: string,
		private _platform: Platform,
		private _duration_seconds: UInt,
		private _relevance: Date,
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
	/**
	 * Return duration in seconds
	 */
	get duration_s() {
		return this._duration_seconds;
	}
	/**
	 * Return getTime() of the date podcast creation
	 */
	get relevance() {
		return this._relevance.getTime();
	}
	public static compareByRelevance(p1: Podcast, p2: Podcast): number {
		return p2.relevance - p1.relevance;
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
		private _password: Password,
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
