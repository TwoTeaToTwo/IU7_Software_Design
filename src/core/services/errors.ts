export class UserFindError extends Error {
	constructor() {
		super("ERROR: Can't find user");
		Object.setPrototypeOf(this, UserFindError.prototype);
	}
}

export class UnsupportableURLError extends Error {
	constructor() {
		super("ERROR: Unknown platform of url");
		Object.setPrototypeOf(this, UnsupportableURLError.prototype);
	}
}
