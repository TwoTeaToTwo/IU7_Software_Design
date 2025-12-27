import { beforeEach, describe, expect, it, vi } from "vitest";
import * as LoginVM from "./LoginViewModel";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

// Мокаем browser и goto
vi.mock("$app/environment", () => ({ browser: true }));
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

// Мокаем authController прямо внутри vi.mock
vi.mock("../stores/Authentication.ts", () => {
	return {
		authController: {
			responseAccessToken: vi.fn().mockResolvedValue(undefined),
		},
	};
});

describe("LoginViewModel functions", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("logout calls errorHandler on fetch failure", async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error("fail"));

		const errorHandler = vi.fn();

		await LoginVM.logout("token", errorHandler);

		expect(errorHandler).toHaveBeenCalledWith("Can't logout");
	});

	it("logout does not call errorHandler if response.ok", async () => {
		global.fetch = vi.fn().mockResolvedValue({ ok: true });

		const errorHandler = vi.fn();

		await LoginVM.logout("token", errorHandler);

		expect(errorHandler).not.toHaveBeenCalled();
	});

	it("logout calls errorHandler if response not ok", async () => {
		global.fetch = vi.fn().mockResolvedValue({ ok: false });

		const errorHandler = vi.fn();

		await LoginVM.logout("token", errorHandler);

		expect(errorHandler).toHaveBeenCalledWith("Can't logout");
	});
});
