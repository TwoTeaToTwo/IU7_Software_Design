import type { FastifyInstance } from "fastify";
import type { User } from "@podcast/core";
import { httpConfig } from "../config.ts";

export class AuthenticationController {
	public static createUserTokens(
		user: User,
		app: FastifyInstance,
	) {
		const payload = user.toJSON();
		const accessToken = app.jwt.sign(payload, {
			expiresIn: httpConfig.accessTokenExpiresIn,
		});
		const refreshToken = app.jwt.sign({ ...payload, type: "refresh" }, {
			expiresIn: httpConfig.refreshTokenExpiresIn,
		});
		return { accessToken, refreshToken };
	}
}
