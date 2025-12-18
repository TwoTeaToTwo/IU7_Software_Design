import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getFeedContent } from "./FeedViewModel.ts";
import type { PodcastViewModel } from "../PodcastViewModel.ts";

// Замокаем browser из $app/environment
vi.mock("$app/environment", () => ({
	browser: true,
}));

// Замокаем Config
vi.mock("../../Config", () => ({
	api: "api",
	domain: "http://test.com",
}));

describe("getFeedContent", () => {
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

	it("should return podcasts with durationText and relevanceText when fetch is successful", async () => {
		const mockPodcasts: PodcastViewModel[] = [
			{
				title: "Podcast 1",
				platform: "Spotify",
				duration_s: 125,
				relevance: "2025-12-18",
				url: "http://example.com/1",
			},
			{
				title: "Podcast 2",
				platform: "Apple",
				duration_s: 3600,
				relevance: "2023-01-01",
				url: "http://example.com/2",
			},
		];

		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						podcasts: mockPodcasts,
						pagination: {
							page: 1,
							podcasts_per_page: 2,
							total_podcasts: 2,
						},
					}),
			} as Response)
		);

		const result = await getFeedContent(2, "access-token", errorHandler);

		expect(result).toHaveLength(2);
		expect(result![0].durationText).toBe("02:05");
		expect(result![0].relevanceText).toBe("Dec 18, 2025");
		expect(result![1].durationText).toBe("01:00:00");
		expect(result![1].relevanceText).toBe("Jan 1, 2023");
		expect(errorHandler).not.toHaveBeenCalled();
	});

	it("should call errorHandler when fetch throws an error", async () => {
		globalThis.fetch = vi.fn(() => Promise.reject("fetch failed"));

		const result = await getFeedContent(2, "access-token", errorHandler);

		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't update feed");
	});

	it("should call errorHandler when response is not ok", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
			} as Response)
		);

		const result = await getFeedContent(2, "access-token", errorHandler);

		expect(result).toBeUndefined();
		expect(errorHandler).toHaveBeenCalledWith("Can't update feed");
	});
});
