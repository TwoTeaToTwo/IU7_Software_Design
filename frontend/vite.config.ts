import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig, type UserConfig } from "vite";
import type { TestOptions } from "vitest";

interface ViteConfigWithVitest extends UserConfig {
	test?: TestOptions;
}

export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
	server: {
		origin: "http://127.0.0.1",
		host: true,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
		include: ["src/**/*.test.{js,ts}"],
	},
} as ViteConfigWithVitest);
