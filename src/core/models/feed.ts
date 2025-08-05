import type { CompareFunction, Id } from "../types.ts";
import type { Podcast } from "./podcast.ts";

export class Feed {
	public static readonly DEFAULT_FEED_SIZE = 10;
	public static readonly EXPAND_FEED_STEP_SIZE = 10;
	public static readonly DEFAULT_SEARCH_DEPTH = 1;
	public static readonly EXPAND_SEARCH_DEPTH_STEP = 1;
	private _max_size = Feed.DEFAULT_FEED_SIZE;
	private _search_depth = Feed.DEFAULT_SEARCH_DEPTH;
	private _contents = new Array<Podcast>();
	constructor(private _user_id: Id) {
	}
	public addContent(content: Podcast): void {
		if (!this._contents.includes(content)) {
			this._contents.push(content);
		}
	}
	public expand(): void {
		this._max_size += Feed.EXPAND_FEED_STEP_SIZE;
		this._search_depth += Feed.EXPAND_SEARCH_DEPTH_STEP;
	}
	public reset(): void {
		this._max_size = Feed.DEFAULT_FEED_SIZE;
		this._search_depth = Feed.DEFAULT_SEARCH_DEPTH;
		this._contents.length = 0;
	}
	public sortContents(compare_method: CompareFunction<Podcast>): void {
		this._contents.sort(compare_method);
	}
	get contents() {
		return this._contents;
	}
	get search_depth() {
		return this._search_depth;
	}
	get max_size() {
		return this._max_size;
	}
	get user_id() {
		return this._user_id;
	}
}
