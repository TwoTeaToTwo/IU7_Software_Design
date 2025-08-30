import { container } from "@podcast/infrastructure";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { loginType } from "../schemas/user.schemas.ts";
import { INJECT_TYPES, type IUserRepository } from "@podcast/core";
import { AuthenticationController } from "./auth.controller.ts";

export class UserController {
	public static async login(
		request: FastifyRequest<{ Body: loginType }>,
		reply: FastifyReply,
	) {
		const userRepo = container.get<IUserRepository>(
			INJECT_TYPES.UserRepository,
		);
		const login = request.body.login;
		const password = request.body.password;
		const user = await userRepo.findByLogin(login);
		const isMatch = user && user.password.password === password;
		if (!isMatch) {
			return reply.code(403).send({
				message: "Invalid login or password",
			});
		} else {
			const { accessToken, refreshToken } = AuthenticationController
				.createUserTokens(user, request.server);
			reply.setCookie("access_token", accessToken, {
				path: "/",
				httpOnly: true,
				secure: true,
			});
			reply.setCookie("refresh_token", refreshToken, {
				path: "/",
				httpOnly: true,
				secure: true,
			});
			// TODO redirect 303
			return { accessToken, refreshToken };
		}
	}
}
