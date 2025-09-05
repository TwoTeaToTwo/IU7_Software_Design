import type { FastifyPluginAsync } from "fastify";
import { UserController } from "../controllers/user.controller.ts";

export const userRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/subscriptions", {
		preHandler: [app.authenticate],
	}, UserController.showUserSubscriptions);
};
