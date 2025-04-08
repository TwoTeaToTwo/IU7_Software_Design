import type { Container } from "inversify";

export class Provider {
	private static _container: Container | null = null;
	private constructor() {}
	public static configureContainer(container: Container): void {
		Provider._container = container;
	}
	public static getContainer() {
		if (!Provider._container) {
			throw Error("ERROR: DI container not configured");
		}
		return Provider._container;
	}
}
