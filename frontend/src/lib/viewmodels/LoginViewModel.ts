import { authController } from "../stores/Authentication.ts";
import { domain } from "../Config.ts";

export class LoginViewModel {
	public static login(login: string, password: string) {
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
				console.log("[user]: logged");
				authController.responseAccessToken().then(() => {
					console.log("[user]: accessToken gotten");
				});
			})
			.catch //TODO
			();
	}
}
