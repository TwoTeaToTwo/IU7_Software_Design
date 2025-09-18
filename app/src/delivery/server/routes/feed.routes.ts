import type { FastifyPluginAsync } from "fastify";
import { getFeedContentSchema } from "../schemas/feed.schemas.ts";
import { FeedController } from "../controllers/feed.controller.ts";

export const feedRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/content", {
		preHandler: [app.authenticate],
		schema: { querystring: getFeedContentSchema },
	}, FeedController.getFeedContent);
};
