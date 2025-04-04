import type { Id, UInt } from "../types.ts";
import type { Podcast, Subscribe } from "../models/models.ts";

export interface ICommand {
	exec(): void;
}

export class GetAllUserSubscribes implements ICommand {
	constructor(private _user_id: Id, private _subscribes: Array<Subscribe>) {}
	public exec(): void {
		// TODO
	}
}

export class GetLastPodcasts implements ICommand {
	constructor(
		private _user_id: Id,
		private _subscribe: Subscribe,
		private _podcasts: Array<Podcast>,
		private _podcasts_max_count: UInt,
	) {}
	public exec(): void {
		// TODO
	}
}
