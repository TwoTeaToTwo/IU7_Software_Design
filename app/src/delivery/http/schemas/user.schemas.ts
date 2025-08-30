import { type Static, Type } from "@sinclair/typebox";

export const loginSchema = Type.Object({
	login: Type.String(),
	password: Type.String({ minLength: 1 }),
});

export type loginType = Static<typeof loginSchema>;

export const loginResponseSchema = Type.Object({
	refreshToken: Type.String(),
	accessToken: Type.String(),
});
