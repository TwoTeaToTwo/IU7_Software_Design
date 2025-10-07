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
		console.log(res.status);
		await res.json();
		return "";
	}
}
