import type { Id } from "../types.ts";
import type { Podcast, Subscribe } from "./models.ts";
import { GetAllUserSubscribes } from "../Controller/commands.ts";

export class Feed {
	public static readonly DEFAULT_FEED_SIZE = 10;
	public static readonly DEFAULT_SEARCH_DEPTH = 0;
	private max_size = Feed.DEFAULT_FEED_SIZE;
	private current_size = 0;
	private search_depth = Feed.DEFAULT_SEARCH_DEPTH;
	private _content = new Array<Podcast>();
	private subscribes = new Array<Subscribe>();

	constructor(private _user_id: Id) {
	}
	public update(): void {
		this.update_subscribes();
		this.update_content();
	}
	private update_subscribes() {
		const cmd = new GetAllUserSubscribes(this._user_id, this.subscribes);
		cmd.exec();
	}
	private update_content() {
		//TODO
	}
	public expand(): void {
		//TODO
	}
	get content() {
		return this._content;
	}
}
