import type { Id, SearchPlatform } from "../types.ts";

export class Subscribe {
	constructor(
		private _id: Id,
		private _url: URL,
		private _title: string,
		private _platform: SearchPlatform,
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
