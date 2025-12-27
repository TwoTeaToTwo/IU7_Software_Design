import type { FastifyReply, FastifyRequest } from "fastify";
import type {
	ChannelService,
	ISubscribeManageRepository,
	ISubscribeRepository,
} from "@podcast/core";
import { container } from "@podcast/infrastructure";
import {
	createUInt,
	INJECT_TYPES,
	Subscribe,
	SubscribeFindError,
	UserFindError,
} from "@podcast/core";
import type {
	GetSubscriptionType,
	SubscribeType,
	UnsubscribeType,
	UpdateSubscriptionBodyType,
	UpdateSubscriptionParamsType,
	UpdateSubscriptionTitleBodyType,
	UpdateSubscriptionTitleParamsType,
} from "../schemas/channel.schemas.ts";

export class ChannelController {
	public static async subscribe(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const channelService = container().get<ChannelService>(
			INJECT_TYPES.ChannelService,
		);
		const subscribeManageRepo = container().get<ISubscribeManageRepository>(
			INJECT_TYPES.SubscribeManageRepository,
		);
		const body = request.body as SubscribeType;
		const channelTitle = body.channel_title;
		const channelURL = new URL(body.channel_url);
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
					.findAllSubscribesByUserId(
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
			return reply.status(401).send("Subscribe error");
		}
		return reply.status(201).send(subscribe);
	}

	public static async unsubscribe(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const channelService = container().get<ChannelService>(
			INJECT_TYPES.ChannelService,
		);
		const params = request.params as UnsubscribeType;
		const channelID = params.id;
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
			return reply.status(401).send("Subscribe error");
		}
		return reply.status(204).send();
	}

	public static async getSubscription(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const params = request.params as GetSubscriptionType;
		const channelId = params.id;
		const subscribeRepository = container().get<ISubscribeRepository>(
			INJECT_TYPES.SubscribeRepository,
		);
		const subscription = await subscribeRepository.findById(
			createUInt(channelId),
		);
		if (!subscription) {
			return reply.status(404).send("Subscription not found");
		}
		return reply.status(200).send(subscription);
	}

	public static async updateSubscription(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const params = request.params as UpdateSubscriptionParamsType;
		const body = request.body as UpdateSubscriptionBodyType;
		const id = createUInt(params.id);
		const url = new URL(body.url);
		const platform = body.platform;
		const title = body.title;
		const subscription = new Subscribe(id, url, title, platform);
		const subscribeRepository = container().get<ISubscribeRepository>(
			INJECT_TYPES.SubscribeRepository,
		);
		const isExists = await subscribeRepository.findById(
			id,
		);
		let result: Subscribe | boolean | null = false;
		if (!isExists) {
			result = await subscribeRepository.create(
				url,
				title,
				platform,
			);
		} else {
			result = await subscribeRepository.save(subscription);
		}
		if (!result) {
			return reply.status(401).send("Update subscription error");
		}
		if (result === true) {
			return reply.status(204).send();
		}
		return reply.status(201).send(result);
	}

	public static async updateTitleSubscription(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const params = request.params as UpdateSubscriptionTitleParamsType;
		const body = request.body as UpdateSubscriptionTitleBodyType;
		const id = createUInt(params.id);
		const title = body.title;
		const subscribeRepository = container().get<ISubscribeRepository>(
			INJECT_TYPES.SubscribeRepository,
		);
		const subscribe = await subscribeRepository.findById(
			id,
		);
		if (!subscribe) {
			return reply.status(404).send("Subscription not found");
		} else {
			const newSubscribe = new Subscribe(
				id,
				subscribe.url,
				title,
				subscribe.platform,
			);
			const result = await subscribeRepository.save(newSubscribe);
			if (!result) {
				return reply.status(401).send("Update subscription error");
			} else {
				return reply.status(200).send(newSubscribe);
			}
		}
	}
}
