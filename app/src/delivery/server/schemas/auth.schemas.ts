import { type Static, Type } from "@sinclair/typebox";

export const loginSchema = Type.Object({
	login: Type.String(),
	password: Type.String({ minLength: 1 }),
});

export type Login = Static<typeof loginSchema>;

export const getAccessTokenResponseSchema = Type.Object({
	accessToken: Type.String(),
});
