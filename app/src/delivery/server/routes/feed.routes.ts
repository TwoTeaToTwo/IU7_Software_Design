import type { FastifyPluginAsync } from "fastify";
import {
	getFeedContentErrorSchema,
	getFeedContentOkSchema,
	getFeedContentSchema,
} from "../schemas/feed.schemas.ts";
import { FeedController } from "../controllers/feed.controller.ts";

export const feedRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/content", {
		preHandler: [app.authenticate],
		schema: {
			querystring: getFeedContentSchema,
			tags: ["user", "feed"],
			summary: "get feed content",
			security: [{ bearerAuth: [] }],
			response: {
				200: getFeedContentOkSchema,
				404: getFeedContentErrorSchema,
			},
		},
	}, FeedController.getFeedContent);
};
