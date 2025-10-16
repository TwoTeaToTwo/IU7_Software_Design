import type { FastifyPluginAsync } from "fastify";
import {
	getSubscriptionErrorSchema,
	getSubscriptionOkSchema,
	getSubscriptionSchema,
	subscribeErrorSchema,
	subscribeOkSchema,
	subscribeSchema,
	unsubscribeErrorSchema,
	unsubscribeParamsSchema,
	updateSubscriptionBodySchema,
	updateSubscriptionCreatedSchema,
	updateSubscriptionErrorSchema,
	updateSubscriptionTitleBodySchema,
	updateSubscriptionTitleErrorSchema,
	updateSubscriptionTitleParamsSchema,
	updateSubscriptionTitleResponseSchema,
} from "../schemas/channel.schemas.ts";
import { ChannelController } from "../controllers/channel.controller.ts";

export const userChannelRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.post("", {
		preHandler: [app.authenticate],
		schema: {
			body: subscribeSchema,
			tags: ["users"],
			summary: "subscribe to channel",
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
			security: [{ bearerAuth: [] }],
			response: {
				201: subscribeOkSchema,
				401: subscribeErrorSchema,
				404: subscribeErrorSchema,
			},
		},
	}, ChannelController.subscribe);
	app.delete("/:id", {
		preHandler: [app.authenticate],
		schema: {
			params: unsubscribeParamsSchema,
			tags: ["users"],
			summary: "unsubscribe from channel",
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
			security: [{ bearerAuth: [] }],
			response: {
				204: { type: "null" },
				401: unsubscribeErrorSchema,
				404: unsubscribeErrorSchema,
			},
		},
	}, ChannelController.unsubscribe);
	app.get("/:id", {
		preHandler: [app.authenticate],
		schema: {
			params: getSubscriptionSchema,
			tags: ["users"],
			summary: "get subscription by id",
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
			security: [{ bearerAuth: [] }],
			response: {
				200: getSubscriptionOkSchema,
				401: getSubscriptionErrorSchema,
				404: getSubscriptionErrorSchema,
			},
		},
	}, () => { //TODO
	});
	app.put("/:id", {
		preHandler: [app.authenticate],
		schema: {
			params: getSubscriptionSchema,
			body: updateSubscriptionBodySchema,
			tags: ["users"],
			summary: "update subscription information",
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
			security: [{ bearerAuth: [] }],
			response: {
				201: updateSubscriptionCreatedSchema,
				204: { type: "null" },
				404: updateSubscriptionErrorSchema,
			},
		},
	}, () => { //TODO
	});
	app.patch("/:id", {
		preHandler: [app.authenticate],
		schema: {
			params: updateSubscriptionTitleParamsSchema,
			body: updateSubscriptionTitleBodySchema,
			tags: ["users"],
			summary: "update subscription title",
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
			security: [{ bearerAuth: [] }],
			response: {
				200: updateSubscriptionTitleResponseSchema,
				401: updateSubscriptionTitleErrorSchema,
				404: updateSubscriptionTitleErrorSchema,
			},
		},
	}, () => { //TODO
	});
};
