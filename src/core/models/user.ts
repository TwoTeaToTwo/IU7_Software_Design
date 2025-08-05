import type { Id } from "../types.ts";

export class IncorrectPasswordError extends Error {
	constructor() {
		super("ERROR: Incorrect password");
		Object.setPrototypeOf(this, IncorrectPasswordError.prototype);
	}
}

export class Password {
	private _password: string;
	constructor(password: string) {
		if (password.length > 0) {
			this._password = password;
		} else {
			throw new IncorrectPasswordError();
		}
	}
	get password() {
		return this._password;
	}
}

export class User {
	constructor(
		private _id: Id,
		private _login: string,
		private _password: Password,
	) {}
	get id() {
		return this._id;
	}
	get login() {
		return this._login;
	}
	get password() {
		return this._password;
	}
}
