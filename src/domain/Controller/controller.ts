import type { ICommand } from "./commands.ts";

class Controller {
	private static instance: Controller;

	private constructor() {}

	public static getInstance() {
		if (!Controller.instance) {
			Controller.instance = new Controller();
		}
		return Controller.instance;
	}

	public exec(cmd: ICommand): void {
		cmd.exec();
	}
}
