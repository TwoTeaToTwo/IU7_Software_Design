import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { FastifyJWT } from "@fastify/jwt";
import type { IUserRepository } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { INJECT_TYPES } from "@podcast/core";
import type { loginType } from "../schemas/auth.schemas.ts";
import { httpConfig } from "../config.ts";
import type { UserPayload } from "../types.ts";

export class AuthenticationController {
	public static generateAccessToken(
		app: FastifyInstance,
		payload: UserPayload,
	) {
		return app.jwt.sign(payload, {
			expiresIn: httpConfig.accessTokenExpiresIn,
		});
	}

	public static generateRefreshToken(
		app: FastifyInstance,
		payload: UserPayload,
	) {
		return app.jwt.sign({ ...payload, type: "refresh" }, {
			expiresIn: httpConfig.refreshTokenExpiresIn,
		});
	}

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
			const refreshToken = AuthenticationController
				.generateRefreshToken(request.server, user.toJSON());
			reply.setCookie("refresh_token", refreshToken, {
				path: "/",
				httpOnly: true,
				secure: true,
			});
			// TODO redirect 303
			return {};
		}
	}

	public static verifyRefreshToken(
		token: string,
		request: FastifyRequest,
	) {
		try {
			const payload = request.jwt.verify<FastifyJWT["user"]>(token);
			return payload;
		} catch {
			return null;
		}
	}

	public static getAccessToken(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const refresh_token = request.cookies.refresh_token;
		if (!refresh_token) {
			return reply.status(401).send({ error: "Refresh token not found" });
		}
		const payload = AuthenticationController.verifyRefreshToken(
			refresh_token,
			request,
		);
		if (!payload) {
			return reply.status(401).send({ error: "Invalid refresh token" });
		}
		const accessToken = AuthenticationController.generateAccessToken(
			request.server,
			payload,
		);
		return { accessToken };
	}
}
