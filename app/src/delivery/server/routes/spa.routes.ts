import type { FastifyPluginAsync } from "fastify";
import { SPAController } from "../controllers/spa.controller.ts";

export const SPARoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/", {
		schema: {
			tags: ["static"],
			summary: "home page",
			response: {
				200: {
					description: "File content",
					content: {
						"application/octet-stream": {
							schema: { type: "string", format: "binary" },
						},
					},
				},
			},
		},
	}, SPAController.loadIndex);
};
