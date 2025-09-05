import type { FastifyPluginAsync } from "fastify";
import { subscribeSchema } from "../schemas/channel.schemas.ts";
import { ChannelController } from "../controllers/channel.controller.ts";

export const channelRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/subscribe", {
		preHandler: [app.authenticate],
		schema: { querystring: subscribeSchema },
	}, ChannelController.subscribe);
};
