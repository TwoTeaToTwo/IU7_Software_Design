import type { SearchService } from "./search_service.ts";
import { inject, injectable } from "npm:inversify";
import type { ISubscribeManageRepository } from "../output_ports/i_subscribe_manage_repository.ts";
import type { IUserRepository } from "../output_ports/i_user_repository.ts";
import type { ISubscribeRepository } from "../output_ports/i_subscribe_repository.ts";
import { INJECT_TYPES, type UInt } from "../types.ts";
import { UnsupportableURLError, UserFindError } from "./errors.ts";

export class SubscribeFindError extends Error {
	constructor() {
		super("ERROR: Can't find subscribe");
		Object.setPrototypeOf(this, SubscribeFindError.prototype);
	}
}

@injectable()
export class ChannelService {
	constructor(
		@inject(INJECT_TYPES.SearchService) private _searcher: SearchService,
		@inject(
			INJECT_TYPES.SubscribeMangeRepository,
		) private _subscribe_manage_repo: ISubscribeManageRepository,
		@inject(
			INJECT_TYPES.UserRepository,
		) private _user_repo: IUserRepository,
		@inject(
			INJECT_TYPES.SubscribeRepository,
		) private _subscribe_repo: ISubscribeRepository,
	) {}

	/**
	 * @param user_id user to subscribe
	 * @param channel_url url of channel
	 * @param channel_title user custom title for channel
	 *
	 * throw UserFindError if can't find user
	 * throw UnsupportableURLError if can't work with given url
	 * @returns true on success else false
	 */
	public async subscribe(
		user_id: UInt,
		channel_url: URL,
		channel_title: string,
	): Promise<boolean> {
		const user = await this._user_repo.findById(user_id);
		if (!user) {
			throw new UserFindError();
		}
		const is_channel_exist = await this._searcher.isChannelExist(
			channel_url,
		);
		if (!is_channel_exist) {
			throw new UnsupportableURLError();
		}
		const platform = this._searcher.getPlatformByURL(channel_url)!; // already check that channel exists
		const subscribe = await this._subscribe_repo.create(
			channel_url,
			channel_title,
			platform,
		);
		if (!subscribe) {
			throw Error(
				"ERROR: ChannelService: subscribe: can't create subscribe",
			);
		} else {
			return await this._subscribe_manage_repo.subscribe(
				user_id,
				subscribe.id,
			);
		}
	}

	/**
	 * @param user_id user for unsubscribe
	 * @param subscribe_id user's subscription
	 *
	 * throw UserFindError if can't find user
	 * throw SubscribeFindError if can't find subscribe
	 * @returns true on success else false
	 */
	public async unsubscribe(
		user_id: UInt,
		subscribe_id: UInt,
	): Promise<boolean> {
		const user = await this._user_repo.findById(user_id);
		if (!user) {
			throw new UserFindError();
		}
		const subscribe = await this._subscribe_repo.findById(subscribe_id);
		if (!subscribe) {
			throw new SubscribeFindError();
		}
		const is_unsubscribed = await this._subscribe_manage_repo.unsubscribe(
			user_id,
			subscribe.id,
		);
		if (is_unsubscribed) {
			const is_deleted = await this._subscribe_repo.delete(subscribe);
			if (!is_deleted) {
				throw Error(
					"ERROR: ChannelService: subscribe: can't delete subscribe",
				);
			}
		}
		return is_unsubscribed;
	}
}
