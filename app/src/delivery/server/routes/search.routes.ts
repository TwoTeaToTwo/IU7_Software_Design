import type { FastifyPluginAsync } from "fastify";
import {
	searchPodcastByQuerySchema,
	searchPodcastByURLSchema,
} from "../schemas/search.schemas.ts";
import { SearchController } from "../controllers/search.controller.ts";

export const searchRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/by-query", {
		preHandler: [app.authenticate],
		schema: { querystring: searchPodcastByQuerySchema },
	}, SearchController.searchPodcastByQuery);
	app.get("/by-url", {
		preHandler: [app.authenticate],
		schema: { querystring: searchPodcastByURLSchema },
	}, SearchController.searchPodcastByURL);
};
