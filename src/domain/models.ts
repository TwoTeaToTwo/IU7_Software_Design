import type { Id, Platform, Url } from "./types.ts";

class Podcast {
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
