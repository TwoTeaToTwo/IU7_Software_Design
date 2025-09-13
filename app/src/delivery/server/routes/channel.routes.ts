import type { FastifyPluginAsync } from "fastify";
import {
	subscribeSchema,
	unsubscribeSchema,
} from "../schemas/channel.schemas.ts";
import { ChannelController } from "../controllers/channel.controller.ts";

export const userChannelRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/subscribe", {
		preHandler: [app.authenticate],
		schema: {
			querystring: subscribeSchema,
		},
	}, ChannelController.subscribe);
	app.get("/unsubscribe", {
		preHandler: [app.authenticate],
		schema: { querystring: unsubscribeSchema },
	}, ChannelController.unsubscribe);
};
