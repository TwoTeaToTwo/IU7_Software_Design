import type { JWT } from "@fastify/jwt";
import type { User } from "@podcast/core";
import type { HookHandlerDoneFunction } from "fastify";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
			done: HookHandlerDoneFunction,
		) => void;
	}
}

export type UserPayload = ReturnType<User["toJSON"]>;

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
