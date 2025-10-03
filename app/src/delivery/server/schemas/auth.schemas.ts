import { type Static, Type } from "@sinclair/typebox";

export const loginSchema = Type.Object({
	login: Type.String(),
	password: Type.String({ minLength: 1 }),
});
export const loginErrorSchema = Type.String();

export type Login = Static<typeof loginSchema>;

export const loginResponseSchema = Type.Object({});

export const getAccessTokenResponseSchema = Type.Object({
	accessToken: Type.String(),
});
export const getAccessTokenErrorSchema = Type.Object({
	accessToken: Type.String(),
});
