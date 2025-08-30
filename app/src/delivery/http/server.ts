import fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { httpConfig } from "./config.ts";
import fjwt from "@fastify/jwt";
import type { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const createServer = () => {
	const app = fastify({ logger: false }).withTypeProvider<
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
	return app;
};

const app = createServer();

export const runServer = async () => {
	await app.listen({
		port: httpConfig.port,
		host: httpConfig.host,
	});
};
