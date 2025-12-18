import { type Writable, writable } from "svelte/store";
import { api, domain } from "../Config.ts";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

const initialIsLogged = browser
	? Boolean(localStorage.getItem("isLogged"))
	: null;
export const isLogged = writable(initialIsLogged ?? false);

if (browser) {
	isLogged.subscribe((v) => {
		localStorage.setItem("isLogged", v ? "true" : "false");
		if (!v) {
			goto("/authorization");
		}
	});
}

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
			this.accessToken = localStorage.getItem("accessToken") ?? undefined;
			return this.accessToken;
		}
		if (this.isAccessTokenExpired(this.accessToken)) {
			return await this.responseAccessToken();
		}
		return this.accessToken;
	}

	public async responseAccessToken(): Promise<string | undefined> {
		if (browser) {
			try {
				const response = await fetch(
					`${domain}/${api}/sessions/access_token`,
					{
						method: "POST",
						credentials: "include",
					},
				);
				const data = await response.json();
				const { accessToken } = data;
				if (!accessToken) {
					throw new Error("accessToken is undefined");
				}
				this.accessToken = accessToken;
				localStorage.setItem("accessToken", this.accessToken ?? "");
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
}

export const authController = new AuthenticationController(isLogged);
