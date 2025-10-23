import type { Subscribe } from "../models/subscribe.ts";
import type { Id, UInt } from "../types.ts";

export interface ISubscribeManageRepository {
	/**
	 * Return null if user doesn't exist
	 */
	findSubscribesByUserId(
		user_id: Id,
		page: UInt,
		channelsPerPage: UInt,
	): Promise<Array<Subscribe> | null>;
	/**
	 * Return null if user doesn't exist
	 */
	findAllSubscribesByUserId(
		user_id: Id,
	): Promise<Array<Subscribe> | null>;
	/**
	 * Return true on success
	 * Subscribe user on source
	 */
	subscribe(user_id: Id, subscribe_id: Id): Promise<boolean>;
	/**
	 * Return true on success
	 * Unsubscribe user from source
	 */
	unsubscribe(user_id: Id, subscribe_id: Id): Promise<boolean>;
}
