import { authController } from "../stores/Authentication.ts";
import { api, domain } from "../Config.ts";
import type { ErrorHandler, MessageHandler } from "../types.ts";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

export const login = (
	login: string,
	password: string,
	messageHandler: MessageHandler,
): void => {
	if (browser) {
		fetch(`${domain}/${api}/sessions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				login: login,
				password: password,
			}),
		})
			.then(() => {
				authController.responseAccessToken().then(() => {
					messageHandler("Logged in successfully", "Message");
					goto("/feed");
				});
			})
			.catch(() => messageHandler("Can't log in", "ERROR"));
	}
};

export const logout = async (
	accessToken: string,
	errorHandler: ErrorHandler,
): Promise<void> => {
	if (browser) {
		try {
			const responseURL = `${domain}/${api}/sessions`;
			const response = await fetch(responseURL, {
				method: "DELETE",
				headers: {
					Authorization: accessToken,
				},
			});
			if (!response.ok) {
				errorHandler("Can't logout");
			}
		} catch {
			errorHandler("Can't logout");
		}
	}
};
