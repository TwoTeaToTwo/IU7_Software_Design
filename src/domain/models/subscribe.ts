import type { Id, Platform } from "../types.ts";

export class Subscribe {
	constructor(
		private _id: Id,
		private _url: URL,
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
