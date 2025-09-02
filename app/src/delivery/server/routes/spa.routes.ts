import type { FastifyPluginAsync } from "fastify";
import { SPAController } from "../controllers/spa.controller.ts";

export const SPARoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.get("/", SPAController.loadIndex);
};
