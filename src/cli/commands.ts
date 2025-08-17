import { Command } from "@cliffy/command";
import { createDIContainer } from "@podcast/infrastructure";
import {
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	SearchService,
	StreamService,
	UnknownPlatformError,
} from "@podcast/core";

import type { IPodcastStream, IUserRepository } from "@podcast/core";

const container = createDIContainer();
const CLIName = "podcast";
const searchCommandName = "search";
const streamCommandName = "play";
const subscribeCommandName = "subscribe";

const createSearchCommand = () => {
	return new Command().option("-u, --url <url:string>", "url").option(
		"-q, --query <query:string>",
		"query",
	).action(
		async (options) => {
			if (options.query) {
				const query = options.query;
				const search_service = container.get<SearchService>(
					INJECT_TYPES.SearchService,
				);
				const podcasts = await search_service.searchPodcast(query);
				console.log(`По запросу ${query} найдено:`);
				for (let i = 0; i < podcasts.length; i++) {
					const podcast = podcasts[i];
					const output = `${i + 1}. ${JSON.stringify(podcast)}`;
					console.log(output);
				}
			} else if (options.url) {
				const url = new URL(options.url);
				const search_service = container.get<SearchService>(
					INJECT_TYPES.SearchService,
				);
				try {
					const podcast = await search_service.searchByURL(url);
					console.log(JSON.stringify(podcast));
				} catch (error) {
					if (
						error instanceof UnknownPlatformError ||
						error instanceof GetSearcherError
					) {
						console.log("ERROR: Unsupported url");
					} else if (error instanceof GetPodcastError) {
						console.log("ERROR: Can't find podcast");
					} else {
						console.log("ERROR: Unknown error");
					}
				}
			} else {
				console.log("ERROR: no options");
			}
		},
	);
};

const playStream = async (stream: IPodcastStream) => {
	const player = "mpv";
	const player_cmd = new Deno.Command(player, {
		args: ["--no-video", "-"],
		stdin: "piped",
	});
	const player_process = player_cmd.spawn();
	await stream.getStream().pipeTo(player_process.stdin);
	await player_process.status;
};

const createPlayCommand = () => {
	return new Command().arguments("<url:string>").action(
		async (_, url: string) => {
			const stream_service = container.get<StreamService>(
				INJECT_TYPES.StreamService,
			);
			const stream = await stream_service.streamPodcast(new URL(url));
			await playStream(stream);
		},
	);
};

const createSubscribeCommand = () => {
	return new Command().arguments(
		"<login:string> <password:string> <url:string>",
	).action(async (_, login: string, password: string, url: string) => {
		const user_repo = container.get<IUserRepository>(
			INJECT_TYPES.UserRepository,
		);
		const user = await user_repo.findByLogin(login);
		if (!user) {
			console.log("ERROR: user not found");
		} else {
			if (user.password.password != password) {
				console.log("ERROR: wrong password");
			} else {
				console.log("ERROR: hello world");
				//TODO subscribe
			}
		}
	});
};

export const createCLI = () => {
	const main_command = new Command().name(CLIName);
	main_command.command(searchCommandName, createSearchCommand());
	main_command.command(streamCommandName, createPlayCommand());
	main_command.command(subscribeCommandName, createSubscribeCommand());
	return main_command;
};
