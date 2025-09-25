import type { FastifyPluginAsync } from "fastify";
import {
	getSubscriptionErrorSchema,
	getSubscriptionOkSchema,
	getSubscriptionQuerySchema,
	subscribeErrorSchema,
	subscribeOkSchema,
	subscribeSchema,
	unsubscribeErrorSchema,
	unsubscribeSchema,
	updateSubscriptionCreatedSchema,
	updateSubscriptionErrorSchema,
	updateSubscriptionSchema,
	updateSubscriptionTitleErrorSchema,
	updateSubscriptionTitleSchema,
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
				404: unsubscribeErrorSchema,
				500: unsubscribeErrorSchema,
			},
		},
	}, ChannelController.unsubscribe);
	app.get("", {
		preHandler: [app.authenticate],
		schema: {
			querystring: getSubscriptionQuerySchema,
			tags: ["user", "channel"],
			summary: "get subscription by id",
			security: [{ bearerAuth: [] }],
			response: {
				200: getSubscriptionOkSchema,
				404: getSubscriptionErrorSchema,
				500: getSubscriptionErrorSchema,
			},
		},
	}, () => { //TODO
	});
	app.put("", {
		preHandler: [app.authenticate],
		schema: {
			body: updateSubscriptionSchema,
			tags: ["user", "channel"],
			summary: "update subscription information",
			security: [{ bearerAuth: [] }],
			response: {
				201: updateSubscriptionCreatedSchema,
				204: { type: "null" },
				500: updateSubscriptionErrorSchema,
			},
		},
	}, () => { //TODO
	});
	app.patch("", {
		preHandler: [app.authenticate],
		schema: {
			body: updateSubscriptionTitleSchema,
			tags: ["user", "channel"],
			summary: "update subscription title",
			security: [{ bearerAuth: [] }],
			response: {
				204: { type: "null" },
				404: updateSubscriptionTitleErrorSchema,
				500: updateSubscriptionTitleErrorSchema,
			},
		},
	}, () => { //TODO
	});
};
