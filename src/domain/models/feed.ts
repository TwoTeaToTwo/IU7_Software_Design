import type { CompareFunction, Id } from "../types.ts";
import type { Podcast, Subscribe } from "./models.ts";
import {
	GetAllUserSubscribes,
	GetLastPodcasts,
} from "../Controller/commands.ts";
import { Controller } from "../Controller/controller.ts";

export class Feed {
	public static readonly DEFAULT_FEED_SIZE = 10;
	public static readonly EXPAND_FEED_STEP_SIZE = 10;
	public static readonly DEFAULT_SEARCH_DEPTH = 1;
	public static readonly EXPAND_SEARCH_DEPTH_STEP = 1;
	private max_size = Feed.DEFAULT_FEED_SIZE;
	private current_size = 0;
	private search_depth = Feed.DEFAULT_SEARCH_DEPTH;
	private _contents = new Array<Podcast>();
	private subscribes = new Array<Subscribe>();
	private controller: Controller;

	constructor(private _user_id: Id) {
		this.controller = Controller.getInstance();
	}
	public update(): void {
		this.updateSubscribes();
		this.updateContent();
	}
	private updateSubscribes(): void {
		const cmd = new GetAllUserSubscribes(this._user_id, this.subscribes);
		this.controller.exec(cmd);
	}
	private updateContent(): void {
		for (const subscribe of this.subscribes) {
			const podcasts = new Array<Podcast>();
			const cmd = new GetLastPodcasts(
				this._user_id,
				subscribe,
				podcasts,
				this.search_depth,
			);
			this.controller.exec(cmd);
			for (const content of podcasts) {
				this.addContent(content);
			}
		}
	}
	private addContent(content: Podcast): void {
		if (this._contents.includes(content)) {
			this._contents.push(content);
		}
	}
	public expand(): void {
		this.max_size += Feed.EXPAND_FEED_STEP_SIZE;
		this.search_depth += Feed.EXPAND_SEARCH_DEPTH_STEP;
	}
	public sortContents(compare_method: CompareFunction<Podcast>): void {
		this._contents.sort(compare_method);
	}
	get contents() {
		return this._contents;
	}
}
