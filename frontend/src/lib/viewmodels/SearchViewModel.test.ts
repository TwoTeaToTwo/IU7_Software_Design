import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchPodcast } from "./SearchViewModel.ts";
import type { MessageHandler } from "../types";
import type { PodcastViewModel } from "./PodcastViewModel";

// Замокаем browser из $app/environment
vi.mock("$app/environment", () => ({
	browser: true,
}));

// Замокаем Config
vi.mock("../Config", () => ({
	api: "api",
	domain: "http://test.com",
}));

describe("searchPodcast", () => {
	let messageHandler: MessageHandler;
	let originalFetch: typeof fetch;

	beforeEach(() => {
		messageHandler = vi.fn();
		originalFetch = globalThis.fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	it("should call searchByQuery when query is not URL and return podcasts with durationText and relevanceText", async () => {
		const mockPodcasts: PodcastViewModel[] = [
			{
				title: "Test Podcast",
				platform: "Spotify",
				duration_s: 125,
				relevance: "2025-12-18",
				url: "http://example.com/podcast",
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
							podcasts_per_page: 1,
							total_podcasts: 1,
						},
					}),
			} as Response)
		);

		const result = await searchPodcast(
			"test query",
			10,
			"access-token",
			messageHandler,
			1,
		);

		expect(result).toHaveLength(1);
		expect(result![0].durationText).toBe("02:05");
		expect(result![0].relevanceText).toBe("Dec 18, 2025");
		expect(messageHandler).toHaveBeenCalledWith(
			"Podcasts has founded",
			"SEARCH",
		);
	});

	it("should call searchByUrl when query is a URL and return podcasts with durationText and relevanceText", async () => {
		const mockPodcasts: PodcastViewModel[] = [
			{
				title: "Test Podcast URL",
				platform: "Apple",
				duration_s: 3600,
				relevance: "2023-01-01",
				url: "http://example.com/podcast",
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
							podcasts_per_page: 1,
							total_podcasts: 1,
						},
					}),
			} as Response)
		);

		const result = await searchPodcast(
			"http://example.com/podcast",
			10,
			"access-token",
			messageHandler,
			1,
		);

		expect(result).toHaveLength(1);
		expect(result![0].durationText).toBe("01:00:00");
		expect(result![0].relevanceText).toBe("Jan 1, 2023");
		expect(messageHandler).toHaveBeenCalledWith(
			"Podcasts has founded",
			"SEARCH",
		);
	});

	it("should call messageHandler on fetch failure", async () => {
		globalThis.fetch = vi.fn(() => Promise.reject("fetch failed"));

		const result = await searchPodcast(
			"fail query",
			10,
			"access-token",
			messageHandler,
			1,
		);

		expect(result).toBeUndefined();
		expect(messageHandler).toHaveBeenCalledWith(
			"Can't find podcasts",
			"ERROR",
		);
	});

	it("should call messageHandler when response is not ok", async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
			} as Response)
		);

		const result = await searchPodcast(
			"fail query",
			10,
			"access-token",
			messageHandler,
			1,
		);

		expect(result).toBeUndefined();
		expect(messageHandler).toHaveBeenCalledWith(
			"Can't find podcasts",
			"ERROR",
		);
	});
});
