import type { CompareFunction, Id, UInt } from "../types.ts";
import type { Podcast } from "./podcast.ts";

export class Feed {
	public static readonly DEFAULT_FEED_SIZE = 10;
	private _max_size = Feed.DEFAULT_FEED_SIZE;
	private _contents = new Array<Podcast>();
	constructor(
		private _user_id: Id,
		private _start_feed_size = Feed.DEFAULT_FEED_SIZE,
	) {
		this._max_size = this._start_feed_size;
	}
	public addNewContent(content: Podcast): void {
		if (
			!this._contents.includes(content) &&
			this._contents.length < this._max_size
		) {
			this._contents.push(content);
		}
	}
	public expand(new_size: UInt): void {
		this._max_size = new_size;
	}
	public reset(): void {
		this._max_size = this._start_feed_size;
		this._contents.length = 0;
	}
	public sortContents(compare_method: CompareFunction<Podcast>): void {
		this._contents.sort(compare_method);
	}
	get contents() {
		return this._contents;
	}
	get max_size() {
		return this._max_size;
	}
	get user_id() {
		return this._user_id;
	}
	get current_size() {
		return this._contents.length;
	}
}
