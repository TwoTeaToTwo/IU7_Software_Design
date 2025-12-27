import { type CompareFunction, createUInt, type Id } from "../types.ts";
import type { Podcast } from "./podcast.ts";
import type { GetPodcastsOptions } from "../output_ports/i_search_strategy.ts";

/**
 * Deprecated
 */
export class Feed {
	private _contents = new Array<Podcast>();
	constructor(
		private _user_id: Id,
		private _options: GetPodcastsOptions,
	) {
	}
	public addNewContent(content: Podcast): void {
		if (
			!this._contents.includes(content) &&
			this._contents.length < this.max_size
		) {
			this._contents.push(content);
		}
	}
	public addPage(): void {
		this._options.pagination.page = createUInt(
			this._options.pagination.page + 1,
		);
	}
	public clear(): void {
		this._options.pagination.page = createUInt(1);
		this._contents.length = 0;
	}
	public sortContents(compare_method: CompareFunction<Podcast>): void {
		this._contents.sort(compare_method);
	}
	get contents() {
		return this._contents;
	}
	/**
	 * return page * podcasts_per_page
	 */
	get max_size() {
		return this._options.pagination.page *
			this._options.pagination.podcastsPerPage;
	}
	get user_id() {
		return this._user_id;
	}
	get current_size() {
		return this._contents.length;
	}
	get options() {
		return this._options;
	}
}
