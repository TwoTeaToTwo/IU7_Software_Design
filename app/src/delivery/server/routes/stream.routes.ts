import type { FastifyPluginAsync } from "fastify";
import {
	streamPodcastErrorSchema,
	streamPodcastSchema,
} from "../schemas/stream.schemas.ts";
import { StreamController } from "../controllers/stream.controller.ts";

export const streamRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("", {
		preHandler: [app.authenticate],
		schema: {
			querystring: streamPodcastSchema,
			tags: [
				"stream",
			],
			summary: "get podcast audio",
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
				200: {
					content: {
						"audio/mpeg": {
							schema: {
								description: "audio response",
								type: "string",
								format: "binary",
							},
						},
					},
				},
				500: {
					...streamPodcastErrorSchema,
				},
			},
		},
	}, StreamController.streamPodcast);
};
