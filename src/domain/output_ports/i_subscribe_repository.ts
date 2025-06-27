import type { Subscribe } from "../models/subscribe.ts";
import type { Id, SearchPlatform } from "../types.ts";

export interface ISubscribeRepository {
	/**
	 * Return true on success
	 */
	delete(subscribe: Subscribe): Promise<boolean>;
	/**
	 * Return Subscribe if can find, else null
	 */
	findById(subscribe_id: Id): Promise<Subscribe | null>;
	/**
	 * Return true on success
	 */
	save(subscribe: Subscribe): Promise<boolean>;
	/**
	 * Return Subscribe on success, else null
	 */
	create(
		url: URL,
		title: string,
		platform: SearchPlatform,
	): Promise<Subscribe | null>;
}
