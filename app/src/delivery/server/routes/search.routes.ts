import type { FastifyPluginAsync } from "fastify";
import {
	searchPodcastsErrorSchema,
	searchPodcastsNotFoundSchema,
	searchPodcastsOkSchema,
	searchPodcastsQuerySchema,
} from "../schemas/search.schemas.ts";
// import { SearchController } from "../controllers/search.controller.ts";

export const searchRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get(
		"",
		{
			preHandler: [app.authenticate],
			schema: {
				querystring: searchPodcastsQuerySchema,
				tags: ["podcasts"],
				summary: "search podcasts by query",
				security: [{ bearerAuth: [] }],
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
				response: {
					200: searchPodcastsOkSchema,
					401: searchPodcastsErrorSchema,
					404: searchPodcastsNotFoundSchema,
				},
			},
		}, // TODO
		() => {},
	);
};
