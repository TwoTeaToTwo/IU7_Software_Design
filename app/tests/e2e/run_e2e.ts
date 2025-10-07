const server = new Deno.Command("deno", {
	args: [
		"run",
		"--allow-env",
		"--env-file",
		"--allow-net",
		"--allow-read",
		"--allow-write",
		"--allow-sys",
		"--allow-run=yt-dlp",
		"./tests/e2e/run_server.ts",
	],
	stdout: "piped",
	stderr: "piped",
}).spawn();

const decoder = new TextDecoder();
for await (const chunk of server.stdout!) {
	const msg = decoder.decode(chunk);
	console.log(msg);
	if (msg.includes("Server started")) break;
}

(async () => {
	for await (const chunk of server.stdout!) {
		console.log("[server stdout]", decoder.decode(chunk));
	}
})();
(async () => {
	for await (const chunk of server.stderr!) {
		console.error("[server stderr]", decoder.decode(chunk));
	}
})();

const status = await new Deno.Command("deno", {
	args: [
		"test",
		"./tests/e2e/search_podcast_by_url.e2e.test.ts",
		"--allow-env",
		"--env-file",
		"--allow-net",
		"--allow-read",
		"--allow-write",
		"--allow-sys",
		"--allow-run=yt-dlp",
	],
	env: {
		NODE_ENV: "test",
	},
	stdout: "inherit",
	stderr: "inherit",
}).spawn().status;

server.kill();
Deno.exit(status.code);
