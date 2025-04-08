import { Provider } from "../services/provider.ts";
import {
	type SearchService,
	SearchServiceSymbol,
} from "../services/search_service.ts";
import type { CompareFunction, Id } from "../types.ts";
import type { Podcast } from "./podcast.ts";
import type { Subscribe } from "./subscribe.ts";

export class Feed {
	public static readonly DEFAULT_FEED_SIZE = 10;
	public static readonly EXPAND_FEED_STEP_SIZE = 10;
	public static readonly DEFAULT_SEARCH_DEPTH = 1;
	public static readonly EXPAND_SEARCH_DEPTH_STEP = 1;
	private max_size = Feed.DEFAULT_FEED_SIZE;
	private search_depth = Feed.DEFAULT_SEARCH_DEPTH;
	private _contents = new Array<Podcast>();
	private subscribes = new Array<Subscribe>();

	constructor(private _user_id: Id) {
	}
	public update(): void {
		this.updateSubscribes();
		this.updateContent();
	}
	private updateSubscribes(): void {
		// TODO
	}
	private updateContent(): void {
		for (const subscribe of this.subscribes) {
			const container = Provider.getContainer();
			const search = container.get<SearchService>(SearchServiceSymbol);
			const podcasts = search.getLastPodcastsByChannel(
				subscribe.url,
				this.search_depth,
			);
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
