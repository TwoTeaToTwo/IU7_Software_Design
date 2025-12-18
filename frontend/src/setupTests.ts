import { vi } from "vitest";

// Мокаем goto из sveltekit/navigation
vi.mock("$app/navigation", () => ({
	goto: vi.fn(),
}));

// Мокаем browser environment
vi.mock("$app/environment", () => ({
	browser: true,
}));
