import type { FastifyPluginAsync } from "fastify";
import {
	getAccessTokenResponseSchema,
	loginSchema,
} from "../schemas/auth.schemas.ts";
import { AuthenticationController } from "../controllers/auth.controller.ts";

export const authenticateRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.post("/login", {
		schema: {
			body: loginSchema,
			response: { 201: {} },
		},
	}, AuthenticationController.login);
	app.post("/get_access_token", {
		schema: { response: { 201: getAccessTokenResponseSchema } },
	}, AuthenticationController.getAccessToken);
	app.delete("/logout", {
		preHandler: [app.authenticate],
	}, AuthenticationController.logout);
};
