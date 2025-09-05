import fastify from "fastify";
import type {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	HookHandlerDoneFunction,
} from "fastify";
import { httpConfig } from "./config.ts";
import fjwt from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyStatic from "@fastify/static";
import * as path from "@std/path";
import { authenticateRoutes } from "./routes/auth.routes.ts";
import { SPARoutes } from "./routes/spa.routes.ts";
import { AuthenticationController } from "./controllers/auth.controller.ts";
import { searchRoutes } from "./routes/search.routes.ts";
import { channelRoutes } from "./routes/channel.routes.ts";
import { userRoutes } from "./routes/user.routes.ts";

const createServer = () => {
	const app = fastify({ logger: true }).withTypeProvider<
		TypeBoxTypeProvider
	>();
	// jwt
	app.register(fjwt, { secret: httpConfig.secretJWT });
	app.addHook("preHandler", (request, _, done) => {
		request.jwt = app.jwt;
		return done();
	});
	app.decorate(
		"authenticate",
		(
			request: FastifyRequest,
			reply: FastifyReply,
			done: HookHandlerDoneFunction,
		) => {
			const token = AuthenticationController.extractAccessTokenFromHeader(
				request,
			);
			if (!token) {
				return reply.status(401).send({
					message: "Authentication required",
				});
			}
			const decoded = AuthenticationController.verifyAccessToken(
				token,
				request,
			);
			if (!decoded) {
				return reply.status(401).send({
					message: "Invalid access token",
				});
			}
			request.user = decoded;
			done();
		},
	);
	// cookie
	app.register(fCookie, {
		secret: httpConfig.secretCookie,
		hook: "preHandler",
	});
	// static
	app.register(fastifyStatic, {
		root: path.resolve(httpConfig.frontendPath),
		prefix: "/",
	});
	// routes
	app.register(authenticateRoutes);
	app.register(SPARoutes);
	app.register(searchRoutes, { prefix: "/api/search" });
	app.register(channelRoutes, { prefix: "/api/channel" });
	app.register(userRoutes, { prefix: "/api/user" });
	return app;
};

class Server {
	private readonly app: FastifyInstance;
	constructor() {
		this.app = createServer();
	}
	public async runServer() {
		await this.app.listen({
			port: httpConfig.port,
			host: httpConfig.host,
		});
	}
}

export const server = new Server();
