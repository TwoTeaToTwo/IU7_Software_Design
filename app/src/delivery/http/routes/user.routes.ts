import type { FastifyPluginAsync } from "fastify";
import { loginResponseSchema, loginSchema } from "../schemas/user.schemas.ts";
import { UserController } from "../controllers/user.controller.ts";

export const userRoutes: FastifyPluginAsync = async (app) => {
	app.post("/login", {
		schema: { body: loginSchema, response: { 201: loginResponseSchema } },
	}, UserController.login);
};
