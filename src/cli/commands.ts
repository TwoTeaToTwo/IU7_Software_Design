import { Command } from "@cliffy/command";
import { createDIContainer } from "@podcast/infrastructure";
import {
	ChannelService,
	createUInt,
	FeedService,
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	SearchService,
	StreamService,
	SubscribeFindError,
	UnknownPlatformError,
	UnsupportableURLError,
} from "@podcast/core";
import type {
	IPodcastStream,
	ISubscribeManageRepository,
	IUserRepository,
} from "@podcast/core";

const container = createDIContainer();
const CLIName = "podcast";
const searchCommandName = "search";
const streamCommandName = "play";
const subscribeCommandName = "subscribe";
const unsubscribeCommandName = "unsubscribe";
const showFeedCommandName = "feed";

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
				console.log(`Found on request ${query}:`);
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

/**
 * @returns user on success else null
 */
const logIn = async (login: string, password: string) => {
	const user_repo = container.get<IUserRepository>(
		INJECT_TYPES.UserRepository,
	);
	let user = await user_repo.findByLogin(login);
	if (!user) {
		console.log("ERROR: user not found");
	} else {
		if (user.password.password != password) {
			console.log("ERROR: wrong password");
			user = null;
		}
	}
	return user;
};

const createSubscribeCommand = () => {
	return new Command().arguments(
		"<login:string> <password:string> <channel:string> <url:string>",
	).action(
		async (
			_,
			login: string,
			password: string,
			channel: string,
			url: string,
		) => {
			const user = await logIn(login, password);
			if (user) {
				const channel_service = container.get<ChannelService>(
					INJECT_TYPES.ChannelService,
				);
				const channel_url = new URL(url);
				try {
					const result = await channel_service.subscribe(
						user.id,
						channel_url,
						channel,
					);
					if (result) {
						console.log("Success");
					} else {
						console.log("Error");
					}
				} catch (error) {
					if (error instanceof UnsupportableURLError) {
						console.log(error.message);
					} else {
						console.log(error);
					}
				}
			}
		},
	);
};

const createUnsubscribeCommand = () => {
	return new Command().arguments(
		"<login:string> <password:string> <subscribe_id:number>",
	).action(
		async (
			_,
			login: string,
			password: string,
			subscribe_id: number,
		) => {
			const user = await logIn(login, password);
			if (user) {
				const channel_service = container.get<ChannelService>(
					INJECT_TYPES.ChannelService,
				);
				try {
					const result = await channel_service.unsubscribe(
						user.id,
						createUInt(subscribe_id),
					);
					if (result) {
						console.log("Success");
					} else {
						console.log("Error");
					}
				} catch (error) {
					if (error instanceof SubscribeFindError) {
						console.log(error.message);
					} else {
						console.log(error);
					}
				}
			}
		},
	);
};

const createShowFeedCommand = () => {
	return new Command().arguments("<login:string> <password:string>").option(
		"-l, --list-subscribes",
		"show user subscribes",
	).action(async (options, login: string, password: string) => {
		const user = await logIn(login, password);
		if (user) {
			if (options.listSubscribes) {
				const subscribe_manage_repo = container.get<
					ISubscribeManageRepository
				>(INJECT_TYPES.SubscribeMangeRepository);
				const subscribes = await subscribe_manage_repo
					.findSubscribesByUserId(user.id);
				for (let i = 0; i < subscribes!.length; i++) {
					console.log(`${i + 1} ${JSON.stringify(subscribes![i])}`);
				}
			} else {
				const feed_service = container.get<FeedService>(
					INJECT_TYPES.FeedService,
				);
				const feed = feed_service.createFeed(user.id);
				await feed_service.updateFeed(feed);
				for (let i = 0; i < feed.contents.length; i++) {
					console.log(`${i + 1} ${JSON.stringify(feed.contents[i])}`);
				}
			}
		}
	});
};

export const createCLI = () => {
	const main_command = new Command().name(CLIName);
	main_command.command(searchCommandName, createSearchCommand());
	main_command.command(streamCommandName, createPlayCommand());
	main_command.command(subscribeCommandName, createSubscribeCommand());
	main_command.command(unsubscribeCommandName, createUnsubscribeCommand());
	main_command.command(showFeedCommandName, createShowFeedCommand());
	return main_command;
};
