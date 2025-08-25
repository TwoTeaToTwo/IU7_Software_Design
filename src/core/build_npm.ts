import { build, emptyDir } from "@deno/dnt";

const outDir = "../out/core";

await emptyDir(outDir);

await build({
	entryPoints: ["./mod.ts"],
	outDir: outDir,
	shims: {
		deno: true,
	},
	testPattern: "**/*.test.{ts,tsx,js,mjs,jsx}",
	compilerOptions: {
		skipLibCheck: true,
	},
	packageManager: "npm",
	mappings: {},
	package: {
		name: "@podcast/core",
		version: Deno.args[0],
		description: "",
		license: "MIT",
		repository: {
			type: "git",
			url: "git+https://github.com/TwoTeaToTwo/IU7_Software_Design.git",
		},
		bugs: {
			url: "https://github.com/TwoTeaToTwo/IU7_Software_Design/issues",
		},
	},
});
