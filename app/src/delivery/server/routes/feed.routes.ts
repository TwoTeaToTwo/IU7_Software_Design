import type { FastifyPluginAsync } from "fastify";
import {
	getFeedContentErrorSchema,
	getFeedContentOkSchema,
	getFeedContentSchema,
} from "../schemas/feed.schemas.ts";
import { FeedController } from "../controllers/feed.controller.ts";

export const feedRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("", {
		preHandler: [app.authenticate],
		schema: {
			querystring: getFeedContentSchema,
			tags: ["users"],
			summary: "get feed content",
			security: [{ bearerAuth: [] }],
			headers: {
				type: "object",
				properties: {
					access_token: {
						type: "string",
						description: "bearer token for authorization",
					},
				},
			},
			response: {
				200: getFeedContentOkSchema,
				404: getFeedContentErrorSchema,
			},
		},
	}, FeedController.getFeedContent);
};
