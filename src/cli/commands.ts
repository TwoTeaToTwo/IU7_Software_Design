import { Command } from "@cliffy/command";
import { createDIContainer } from "@podcast/infrastructure";
import {
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	SearchService,
	UnknownPlatformError,
} from "@podcast/core";

const container = createDIContainer();
const CLIName = "podcast";
const searchCommandName = "search";

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
					const output = `${
						i + 1
					}. ${podcast.title}; platform=${podcast.platform}`;
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
			}
		},
	);
};

export const createCLI = () => {
	const main_command = new Command().name(CLIName);
	main_command.command(searchCommandName, createSearchCommand());
	return main_command;
};
