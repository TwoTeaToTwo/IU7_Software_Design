import type { FastifyPluginAsync } from "fastify";
import {
	searchPodcastByQueryOkSchema,
	searchPodcastByQuerySchema,
	searchPodcastByURLErrorSchema,
	searchPodcastByURLOkSchema,
	searchPodcastByURLSchema,
} from "../schemas/search.schemas.ts";
import { SearchController } from "../controllers/search.controller.ts";

export const searchRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/results", {
		preHandler: [app.authenticate],
		schema: {
			querystring: searchPodcastByQuerySchema,
			tags: ["podcast"],
			summary: "search podcasts by query",
			security: [{ bearerAuth: [] }],
			response: {
				200: searchPodcastByQueryOkSchema,
			},
		},
	}, SearchController.searchPodcastByQuery);
	app.get("/result", {
		preHandler: [app.authenticate],
		schema: {
			querystring: searchPodcastByURLSchema,
			tags: ["podcast"],
			summary: "search podcast by url",
			security: [{ bearerAuth: [] }],
			response: {
				200: searchPodcastByURLOkSchema,
				404: searchPodcastByURLErrorSchema,
				500: searchPodcastByURLErrorSchema,
			},
		},
	}, SearchController.searchPodcastByURL);
};
