import fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { httpConfig } from "./config.ts";
import fjwt from "@fastify/jwt";
import type { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyStatic from "@fastify/static";
import * as path from "@std/path";
import { authenticateRoutes } from "./routes/auth.routes.ts";
import { SPARoutes } from "./routes/spa.routes.ts";

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
		(request: FastifyRequest, reply: FastifyReply) => {
			// TODO get access_token from ?
			const token = request.cookies.access_token;
			if (!token) {
				return reply.status(401).send({
					message: "Authentication required",
				});
			}
			const decoded = request.jwt.verify<FastifyJWT["user"]>(token);
			request.user = decoded;
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
