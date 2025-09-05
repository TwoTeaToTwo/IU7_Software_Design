import type { FastifyPluginAsync } from "fastify";
import { UserController } from "../controllers/user.controller.ts";
import { feedRoutes } from "./feed.routes.ts";
import { userChannelRoutes } from "./channel.routes.ts";

export const userRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/subscriptions", {
		preHandler: [app.authenticate],
	}, UserController.showUserSubscriptions);
	app.register(feedRoutes, { prefix: "/feed" });
	app.register(userChannelRoutes, { prefix: "/channel" });
};
