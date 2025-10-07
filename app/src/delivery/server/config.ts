import { z } from "zod";

const HTTPConfigSchema = z.object({
	host: z.string(),
	port: z.number().int().nonnegative(),
	secretJWT: z.string(),
	secretCookie: z.string(),
	accessTokenExpiresIn: z.string(),
	refreshTokenExpiresIn: z.string(),
	frontendPath: z.string(),
	isTestMode: z.boolean(),
});

const loadHTTPConfig = () => {
	const host = Deno.env.get("HOST");
	const port = Number(Deno.env.get("PORT"));
	const secretJWT = Deno.env.get("SECRET_JWT");
	const secretCookie = Deno.env.get("SECRET_COOKIE");
	const accessTokenExpiresIn = "3m";
	const refreshTokenExpiresIn = "30d";
	const frontendPath = Deno.env.get("FRONTEND_PATH");
	const isTestMode = Deno.env.get("NODE_ENV") === "test";
	const config = {
		host,
		port,
		secretJWT,
		secretCookie,
		accessTokenExpiresIn,
		refreshTokenExpiresIn,
		frontendPath,
		isTestMode,
	};
	return HTTPConfigSchema.parse(config);
};

export const httpConfig = loadHTTPConfig();
