import { describe, expect, it } from "vitest";
import { durationSecondsToText, relevanceToText } from "./PodcastViewModel.ts";

describe("PodcastViewModel utils", () => {
	describe("durationSecondsToText", () => {
		it("should format duration less than 1 hour correctly", () => {
			expect(durationSecondsToText(0)).toBe("00:00");
			expect(durationSecondsToText(45)).toBe("00:45");
			expect(durationSecondsToText(125)).toBe("02:05");
			expect(durationSecondsToText(3599)).toBe("59:59"); // 59 min 59 sec
		});

		it("should format duration 1 hour or more correctly", () => {
			expect(durationSecondsToText(3600)).toBe("01:00:00");
			expect(durationSecondsToText(3665)).toBe("01:01:05");
			expect(durationSecondsToText(7325)).toBe("02:02:05");
		});
	});

	describe("relevanceToText", () => {
		it("should format date to US string correctly", () => {
			const date = new Date("2025-12-18T15:30:00Z");
			expect(relevanceToText(date)).toBe("Dec 18, 2025");

			const date2 = new Date("2023-01-01T00:00:00Z");
			expect(relevanceToText(date2)).toBe("Jan 1, 2023");
		});
	});
});
