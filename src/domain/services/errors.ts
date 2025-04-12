export class UserFindError extends Error {
	constructor() {
		super("ERROR: Can't find user");
		Object.setPrototypeOf(this, UserFindError.prototype);
	}
}
