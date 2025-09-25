import type { FastifyPluginAsync } from "fastify";
import {
	subscribeErrorSchema,
	subscribeOkSchema,
	subscribeSchema,
	unsubscribeSchema,
} from "../schemas/channel.schemas.ts";
import { ChannelController } from "../controllers/channel.controller.ts";

export const userChannelRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.post("", {
		preHandler: [app.authenticate],
		schema: {
			querystring: subscribeSchema,
			tags: ["user", "channel"],
			summary: "subscribe to channel",
			security: [{ bearerAuth: [] }],
			response: {
				201: subscribeOkSchema,
				404: subscribeErrorSchema,
				500: subscribeErrorSchema,
			},
		},
	}, ChannelController.subscribe);
	app.delete("", {
		preHandler: [app.authenticate],
		schema: {
			querystring: unsubscribeSchema,
			tags: ["user", "channel"],
			summary: "unsubscribe from channel",
			security: [{ bearerAuth: [] }],
			response: {
				204: { type: "null" },
				404: subscribeErrorSchema,
				500: subscribeErrorSchema,
			},
		},
	}, ChannelController.unsubscribe);
};
