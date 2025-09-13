import { authController } from "../stores/Authentication.ts";
import { domain } from "../Config.ts";
import { messageHandler } from "../types.ts";

export class LoginViewModel {
	public static login(
		login: string,
		password: string,
		messageHandler: messageHandler,
	) {
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
	}
}
