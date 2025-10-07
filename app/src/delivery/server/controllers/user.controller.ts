import type { FastifyReply, FastifyRequest } from "fastify";
import type { ISubscribeManageRepository } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { INJECT_TYPES } from "@podcast/core";

export class UserController {
	public static async showUserSubscriptions(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const subscribeManageRepo = container().get<ISubscribeManageRepository>(
			INJECT_TYPES.SubscribeManageRepository,
		);
		const userID = request.user.id;
		const subscribes = await subscribeManageRepo.findSubscribesByUserId(
			userID,
		);
		if (!subscribes) {
			return reply.status(404).send("User not found");
		}
		return reply.status(200).send(subscribes);
	}
}
