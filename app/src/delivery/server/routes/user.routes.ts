import type { FastifyPluginAsync } from "fastify";
import { UserController } from "../controllers/user.controller.ts";
import { feedRoutes } from "./feed.routes.ts";
import { userChannelRoutes } from "./channel.routes.ts";
import {
	showUserSubscriptionsOkSchema,
	showUserSubscriptionsUserNotFoundSchema,
} from "../schemas/user.schemas.ts";

export const userRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/subscriptions", {
		preHandler: [app.authenticate],
		schema: {
			tags: [
				"user",
			],
			summary: "get array of user subscriptions",
			response: {
				200: showUserSubscriptionsOkSchema,
				404: showUserSubscriptionsUserNotFoundSchema,
			},
		},
	}, UserController.showUserSubscriptions);
	app.register(feedRoutes, { prefix: "/feed" });
	app.register(userChannelRoutes, { prefix: "/channel" });
};
