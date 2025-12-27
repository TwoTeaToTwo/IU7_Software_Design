import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	getSubscriptions,
	subscribe,
	type SubscribeViewModel,
	unsubscribe,
} from "./SubscribeViewModel.ts";

// Замокаем browser
vi.mock("$app/environment", () => ({
	browser: true,
}));

// Замокаем Config
vi.mock("../Config.ts", () => ({
	api: "api",
	domain: "http://test.com",
}));

describe("SubscriptionService", () => {
	let errorHandler: (msg: string) => void;
	let originalFetch: typeof fetch;

	beforeEach(() => {
		errorHandler = vi.fn();
		originalFetch = globalThis.fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	// --- getSubscriptions ---
	it("getSubscriptions returns channels when fetch is successful", async () => {
		const mockChannels: SubscribeViewModel[] = [
			{ id: 1, title: "A", url: "url1", platform: "Spotify" },
			{ id: 2, title: "B", url: "url2", platform: "Apple" },
		];

		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({ channels: mockChannels, pagination: {} }),
			} as Response)
		);

		const result = await getSubscriptions("token", errorHandler);

		expect(result).toEqual(mockChannels);
		expect(errorHandler).not.toHaveBeenCalled();
	});

	it("getSubscriptions calls errorHandler when response is not ok", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({ ok: false } as Response)
		);

		const result = await getSubscriptions("token", errorHandler);

		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't get subscriptions");
	});

	// --- unsubscribe ---
	it("unsubscribe returns true when fetch is successful", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(true),
			} as Response)
		);

		const result = await unsubscribe("token", 1, errorHandler);
		expect(result).toBe(true);
		expect(errorHandler).not.toHaveBeenCalled();
	});

	it("unsubscribe calls errorHandler when fetch fails", async () => {
		globalThis.fetch = vi.fn(() => Promise.reject("fail"));

		const result = await unsubscribe("token", 1, errorHandler);
		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't unsubscribe");
	});

	it("unsubscribe calls errorHandler when response not ok", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({ ok: false } as Response)
		);

		const result = await unsubscribe("token", 1, errorHandler);
		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't unsubscribe");
	});

	// --- subscribe ---
	it("subscribe returns SubscribeViewModel when fetch is successful", async () => {
		const mockChannel: SubscribeViewModel = {
			id: 1,
			title: "A",
			url: "url",
			platform: "Spotify",
		};

		globalThis.fetch = vi.fn(() =>
			Promise.resolve(
				{
					ok: true,
					json: () => Promise.resolve(mockChannel),
				} as Response,
			)
		);

		const result = await subscribe("token", "A", "url", errorHandler);
		expect(result).toEqual(mockChannel);
		expect(errorHandler).not.toHaveBeenCalled();
	});

	it("subscribe calls errorHandler when fetch fails", async () => {
		globalThis.fetch = vi.fn(() => Promise.reject("fail"));

		const result = await subscribe("token", "A", "url", errorHandler);
		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't subscribe!");
	});

	it("subscribe calls errorHandler when response not ok", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({ ok: false } as Response)
		);

		const result = await subscribe("token", "A", "url", errorHandler);
		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't subscribe!");
	});
});
