import type { JWT } from "@fastify/jwt";
import type { User } from "@podcast/core";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
}

export type UserPayload = ReturnType<User["toJSON"]>;

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
