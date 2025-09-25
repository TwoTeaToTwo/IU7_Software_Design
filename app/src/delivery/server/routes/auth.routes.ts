import type { FastifyPluginAsync } from "fastify";
import {
	getAccessTokenErrorSchema,
	getAccessTokenResponseSchema,
	loginErrorSchema,
	loginResponseSchema,
	loginSchema,
} from "../schemas/auth.schemas.ts";
import { AuthenticationController } from "../controllers/auth.controller.ts";

export const authenticateRoutes: FastifyPluginAsync = async (app) => {
	await Promise.resolve();
	app.post("/session", {
		schema: {
			tags: ["session"],
			summary: "log in",
			body: loginSchema,
			response: { 201: loginResponseSchema, 403: loginErrorSchema },
		},
	}, AuthenticationController.login);
	app.post("/session/access_token", {
		schema: {
			tags: ["session"],
			summary: "get access token",
			response: {
				201: getAccessTokenResponseSchema,
				401: getAccessTokenErrorSchema,
			},
		},
	}, AuthenticationController.getAccessToken);
	app.delete("/session", {
		preHandler: [app.authenticate],
		schema: {
			tags: ["session"],
			summary: "log out",
			security: [{ bearerAuth: [] }],
			response: {
				204: { type: "null" },
			},
		},
	}, AuthenticationController.logout);
};
