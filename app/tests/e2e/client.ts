import testConfig from "./config.ts";

export class Client {
	private readonly domain: string;
	private refreshToken: string;

	constructor() {
		this.domain = testConfig.domain;
		this.refreshToken = "";
	}

	public async login(login: string, password: string): Promise<string> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				login: login,
				password: password,
			}),
		};
		const res = await fetch(`${this.domain}/login`, options);
		const setCookie = res.headers.get("set-cookie");
		if (setCookie) {
			const cookie = setCookie.split(",").map((c) => c.split(";")[0]);
			console.log(cookie);
		}
		await res.json();
		return "";
	}
}
