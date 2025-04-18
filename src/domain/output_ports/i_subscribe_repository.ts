import type { Subscribe } from "../models/subscribe.ts";
import type { Id } from "../types.ts";

export interface ISubscribeRepository {
	/**
	 * Return true on success
	 */
	delete(subscribe: Subscribe): boolean;
	/**
	 * Return Subscribe if can find, else null
	 */
	findById(subscribe_id: Id): Subscribe | null;
	/**
	 * Return true on success
	 */
	save(subscribe: Subscribe): boolean;
	/**
	 * Return null if user doesn't exist
	 */
	findByUserId(user_id: Id): Array<Subscribe> | null;
}
