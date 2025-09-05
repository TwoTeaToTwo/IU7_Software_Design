import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChannelService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { INJECT_TYPES, UserFindError } from "@podcast/core";
import type { SubscribeType } from "../schemas/channel.schemas.ts";

export class ChannelController {
	public static async subscribe(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		console.log("1");
		const channelService = container.get<ChannelService>(
			INJECT_TYPES.ChannelService,
		);
		const query = request.query as SubscribeType;
		const channelTitle = query.channel_title;
		const channelURL = new URL(query.channel_url);
		const userID = request.user.id;
		let result = false;
		try {
			result = await channelService.subscribe(
				userID,
				channelURL,
				channelTitle,
			);
		} catch (error) {
			if (error instanceof UserFindError) {
				return reply.status(404).send("User not found");
			}
		}
		if (!result) {
			return reply.status(500).send("Subscribe error");
		}
		return reply.status(200).send(result);
	}
}
