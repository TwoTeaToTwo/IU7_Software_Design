import type { Id } from "../types.ts";
import type { Subscribe } from "../models/models.ts";

export interface ICommand {
	exec(): void;
}

export class GetAllUserSubscribes implements ICommand {
	constructor(private _user_id: Id, private _subscribes: Array<Subscribe>) {}
	public exec(): void {
		// TODO
	}
}