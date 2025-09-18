import type { FastifyPluginAsync } from "fastify";
import { streamPodcastSchema } from "../schemas/stream.schemas.ts";
import { StreamController } from "../controllers/stream.controller.ts";

export const streamRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/play", {
		preHandler: [app.authenticate],
		schema: { querystring: streamPodcastSchema },
	}, StreamController.streamPodcast);
};
