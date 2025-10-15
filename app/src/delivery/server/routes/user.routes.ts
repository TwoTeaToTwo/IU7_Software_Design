import type { FastifyPluginAsync } from "fastify";
import { UserController } from "../controllers/user.controller.ts";
import { feedRoutes } from "./feed.routes.ts";
import { userChannelRoutes } from "./channel.routes.ts";
import {
	showUserSubscriptionsOkSchema,
	showUserSubscriptionsQuery,
	showUserSubscriptionsUserNotFoundSchema,
} from "../schemas/user.schemas.ts";

export const userRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/channels", {
		preHandler: [app.authenticate],
		schema: {
			tags: [
				"users",
			],
			querystring: showUserSubscriptionsQuery,
			summary: "get array of user subscriptions",
			security: [{ bearerAuth: [] }],
			headers: {
				type: "object",
				properties: {
					access_token: {
						type: "string",
						description: "bearer token for authorization",
					},
				},
				required: ["access_token"],
			},
			response: {
				200: showUserSubscriptionsOkSchema,
				401: showUserSubscriptionsUserNotFoundSchema,
			},
		},
	}, UserController.showUserSubscriptions);
	app.register(feedRoutes, { prefix: "/contents" });
	app.register(userChannelRoutes, { prefix: "/channels" });
};
