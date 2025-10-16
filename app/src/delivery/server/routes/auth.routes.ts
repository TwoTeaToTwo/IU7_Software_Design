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
	app.post("/sessions", {
		schema: {
			tags: ["sessions"],
			summary: "log in",
			body: loginSchema,
			response: {
				201: {
					headers: {
						"refresh_token": {
							type: "string",
							description: "http-only cookie",
						},
					},
					...loginResponseSchema,
				},
				401: loginErrorSchema,
			},
		},
	}, AuthenticationController.login);
	app.post("/sessions/access_token", {
		schema: {
			tags: ["sessions"],
			summary: "get access token",
			headers: {
				type: "object",
				properties: {
					refresh_token: {
						type: "string",
						description: "http-only cookie",
					},
				},
				required: ["refresh_token"],
			},
			response: {
				201: getAccessTokenResponseSchema,
				401: getAccessTokenErrorSchema,
			},
		},
	}, AuthenticationController.getAccessToken);
	app.delete("/sessions", {
		preHandler: [app.authenticate],
		schema: {
			tags: ["sessions"],
			summary: "log out",
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
			security: [{ bearerAuth: [] }],
			response: {
				204: { type: "null" },
			},
		},
	}, AuthenticationController.logout);
};
