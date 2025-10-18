import type { FastifyReply, FastifyRequest } from "fastify";
import type { ISubscribeManageRepository } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { createUInt, INJECT_TYPES } from "@podcast/core";
import type { ShowUserSubscriptionsType } from "../schemas/user.schemas.ts";

export class UserController {
	public static async showUserSubscriptions(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const requestQuery = request.query as ShowUserSubscriptionsType;
		const page = createUInt(requestQuery.page);
		const channelsPerPage = createUInt(requestQuery.channels_per_page);
		const subscribeManageRepo = container().get<ISubscribeManageRepository>(
			INJECT_TYPES.SubscribeManageRepository,
		);
		const userID = request.user.id;
		const subscribes = await subscribeManageRepo.findSubscribesByUserId(
			userID,
			page,
			channelsPerPage,
		);
		if (!subscribes) {
			return reply.status(404).send("User not found");
		}
		return reply.status(200).send({
			subscribes: subscribes,
			pagination: {
				page,
				channels_per_page: channelsPerPage,
				total_channels: (page - 1) * channelsPerPage +
					subscribes.length,
			},
		});
	}
}
