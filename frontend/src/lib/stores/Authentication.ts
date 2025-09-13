import { Writable, writable } from "svelte/store";
import { domain } from "../Config.ts";

export const isLogged = writable(false);

class AuthenticationController {
	private accessToken: string | undefined;

	constructor(private _isLogged: Writable<boolean>) {}

	private isAccessTokenExpired(token: string): boolean {
		try {
			const parts = token.split(".");
			if (parts.length !== 3) {
				throw new Error("Invalid JWT format");
			}
			const payload = JSON.parse(atob(parts[1]));
			if (payload.exp) {
				const expDate = new Date(payload.exp);
				return Date.now() > expDate.getTime();
			}
			return true;
		} catch (error) {
			console.error("Error decoding token:", error);
			return true;
		}
	}

	public async getAccessToken(): Promise<string | undefined> {
		if (!this.accessToken) {
			return undefined;
		}
		if (this.isAccessTokenExpired(this.accessToken)) {
			return await this.responseAccessToken();
		}
		return this.accessToken;
	}

	public async responseAccessToken(): Promise<string | undefined> {
		try {
			const response = await fetch(`${domain}/get_access_token`, {
				method: "POST",
				credentials: "include",
			});
			const { accessToken } = await response.json();
			if (!accessToken) {
				throw new Error("accessToken is undefined");
			}
			this.accessToken = accessToken;
			this._isLogged.set(true);
			return accessToken;
		} catch (error) {
			console.log(error);
			this.accessToken = undefined;
			this._isLogged.set(false);
			return undefined;
		}
	}
}

export const authController = new AuthenticationController(isLogged);
