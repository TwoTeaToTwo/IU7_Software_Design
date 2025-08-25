import { build, emptyDir } from "@deno/dnt";

const outDir = "../out/database/postgres";

await emptyDir(outDir);

await build({
	entryPoints: ["./mod.ts"],
	outDir: outDir,
	shims: {
		deno: true,
	},
	package: {
		name: "@podcast/database_postgres",
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
