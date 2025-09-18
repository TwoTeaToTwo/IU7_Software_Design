import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChannelService, ISubscribeManageRepository } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import {
	createUInt,
	INJECT_TYPES,
	type Subscribe,
	SubscribeFindError,
	UserFindError,
} from "@podcast/core";
import type {
	SubscribeType,
	UnsubscribeType,
} from "../schemas/channel.schemas.ts";

export class ChannelController {
	public static async subscribe(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const channelService = container.get<ChannelService>(
			INJECT_TYPES.ChannelService,
		);
		const subscribeManageRepo = container.get<ISubscribeManageRepository>(
			INJECT_TYPES.SubscribeManageRepository,
		);
		const query = request.query as SubscribeType;
		const channelTitle = query.channel_title;
		const channelURL = new URL(query.channel_url);
		const userID = request.user.id;
		let result = false;
		let subscribe: Subscribe | undefined;
		try {
			result = await channelService.subscribe(
				userID,
				channelURL,
				channelTitle,
			);
			if (result) {
				const subscribes = await subscribeManageRepo
					.findSubscribesByUserId(
						userID,
					);
				if (subscribes) {
					subscribe = subscribes.find((sub) =>
						sub.url.toString() === channelURL.toString() &&
						sub.title === channelTitle
					);
				}
			}
		} catch (error) {
			if (error instanceof UserFindError) {
				return reply.status(404).send("User not found");
			}
		}
		if (!result && !subscribe) {
			return reply.status(500).send("Subscribe error");
		}
		return reply.status(200).send(subscribe);
	}

	public static async unsubscribe(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const channelService = container.get<ChannelService>(
			INJECT_TYPES.ChannelService,
		);
		const query = request.query as UnsubscribeType;
		const channelID = query.channel_id;
		const userID = request.user.id;
		let result = false;
		try {
			result = await channelService.unsubscribe(
				userID,
				createUInt(channelID),
			);
		} catch (error) {
			if (error instanceof UserFindError) {
				return reply.status(404).send("User not found");
			} else if (error instanceof SubscribeFindError) {
				return reply.status(404).send("Subscription not found");
			}
		}
		if (!result) {
			return reply.status(500).send("Subscribe error");
		}
		return reply.status(200).send(result);
	}
}
