import { authController } from "../stores/Authentication.ts";
import { domain } from "../Config.ts";
import { errorHandler, messageHandler } from "../types.ts";

export const login = (
	login: string,
	password: string,
	messageHandler: messageHandler,
): void => {
	fetch(`${domain}/login`, {
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
			});
		})
		.catch(() => messageHandler("Can't log in", "ERROR"));
};

export const logout = async (
	accessToken: string,
	errorHandler: errorHandler,
): Promise<void> => {
	try {
		const responseURL = `${domain}/logout`;
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
};
