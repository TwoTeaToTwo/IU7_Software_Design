import type { JWT } from "@fastify/jwt";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
}

interface UserPayload {
	login: string;
	password: string;
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
