import { Command } from "@cliffy/command";
import { container, globalLogger } from "@podcast/infrastructure";
import {
	createUInt,
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	SubscribeFindError,
	UnknownPlatformError,
	UnsupportableURLError,
} from "@podcast/core";
import type {
	ChannelService,
	FeedService,
	IPodcastStream,
	ISubscribeManageRepository,
	IUserRepository,
	SearchService,
	StreamService,
} from "@podcast/core";

const CLIName = "podcast";
const searchCommandName = "search";
const streamCommandName = "play";
const subscribeCommandName = "subscribe";
const unsubscribeCommandName = "unsubscribe";
const showFeedCommandName = "feed";

const defaultUserId = createUInt(1);

const createSearchCommand = () => {
	return new Command().option("-u, --url <url:string>", "url").option(
		"-q, --query <query:string>",
		"query",
	).action(
		async (options) => {
			if (options.query) {
				const query = options.query;
				globalLogger.info(
					`[user] search query=${query} command executed`,
				);
				const search_service = container().get<SearchService>(
					INJECT_TYPES.SearchService,
				);
				const podcasts = await search_service.searchPodcast(
					defaultUserId,
					query,
					{
						pagination: {
							page: createUInt(1),
							podcastsPerPage: createUInt(5),
						},
					},
				);
				globalLogger.info(
					`[user] founded ${podcasts.length} results on request`,
				);
				console.log(`Founded on request ${query}:`);
				for (let i = 0; i < podcasts.length; i++) {
					const podcast = podcasts[i];
					const output = `${i + 1}. ${JSON.stringify(podcast)}`;
					console.log(output);
				}
			} else if (options.url) {
				const url = new URL(options.url);
				globalLogger.info(
					`[user] search url=${options.url} command executed`,
				);
				const search_service = container().get<SearchService>(
					INJECT_TYPES.SearchService,
				);
				try {
					const podcast = await search_service.searchByURL(url);
					globalLogger.info(
						`[user] podcast founded`,
					);
					console.log(JSON.stringify(podcast));
				} catch (error) {
					if (
						error instanceof UnknownPlatformError ||
						error instanceof GetSearcherError
					) {
						globalLogger.error(`unsupported url=${options.url}`);
						console.log("ERROR: Unsupported url");
					} else if (error instanceof GetPodcastError) {
						globalLogger.error(
							`can't get info from url=${options.url}`,
						);
						console.log("ERROR: Can't find podcast");
					} else {
						globalLogger.critical(
							error,
						);
						console.log("ERROR: Unknown error");
					}
				}
			} else {
				globalLogger.error(
					`wrong usage of search command`,
				);
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
	globalLogger.info(
		`[user] play command finished`,
	);
};

const createPlayCommand = () => {
	return new Command().arguments("<url:string>").action(
		async (_, url: string) => {
			globalLogger.info(
				`[user] play command executed`,
			);
			const stream_service = container().get<StreamService>(
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
	const user_repo = container().get<IUserRepository>(
		INJECT_TYPES.UserRepository,
	);
	let user = await user_repo.findByLogin(login);
	if (!user) {
		globalLogger.warn("user not found");
		console.log("ERROR: user not found");
	} else {
		if (user.password.password != password) {
			globalLogger.warn("wrong password");
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
				globalLogger.info("[user] login successful");
				globalLogger.info("[user] subscribe command executed");
				const channel_service = container().get<ChannelService>(
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
						globalLogger.info("[user] subscribed successful");
						console.log("Success");
					} else {
						globalLogger.warn("[user] can't subscribe");
						console.log("Error");
					}
				} catch (error) {
					if (error instanceof UnsupportableURLError) {
						globalLogger.error("unsupportable url");
						console.log(error.message);
					} else {
						globalLogger.critical(error);
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
				globalLogger.info("[user] login successful");
				globalLogger.info("[user] unsubscribe command executed");
				const channel_service = container().get<ChannelService>(
					INJECT_TYPES.ChannelService,
				);
				try {
					const result = await channel_service.unsubscribe(
						user.id,
						createUInt(subscribe_id),
					);
					if (result) {
						globalLogger.info("[user] unsubscribed successful");
						console.log("Success");
					} else {
						globalLogger.warn("[user] can't unsubscribe");
						console.log("Error");
					}
				} catch (error) {
					if (error instanceof SubscribeFindError) {
						console.log("ERROR: already unsubscribed");
						globalLogger.warn("[user] already unsubscribed");
					} else {
						globalLogger.critical(error);
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
	).option("-s, --show-content <feed_size:number>", "show feed contents")
		.action(async (options, login: string, password: string) => {
			const user = await logIn(login, password);
			if (user) {
				globalLogger.info("[user] login successful");
				if (options.listSubscribes) {
					globalLogger.info(
						"[user] show user subscribes command executed",
					);
					const subscribe_manage_repo = container().get<
						ISubscribeManageRepository
					>(INJECT_TYPES.SubscribeManageRepository);
					const subscribes = await subscribe_manage_repo
						.findSubscribesByUserId(
							user.id,
							createUInt(1),
							createUInt(100),
						);
					globalLogger.info(
						`[user] subscribes count=${subscribes?.length}`,
					);
					for (let i = 0; i < subscribes!.length; i++) {
						console.log(
							`${i + 1} ${JSON.stringify(subscribes![i])}`,
						);
					}
				} else if (options.showContent) {
					globalLogger.info(
						"[user] show feed contents command executed",
					);
					const feed_service = container().get<FeedService>(
						INJECT_TYPES.FeedService,
					);
					const contents = await feed_service.getFeedPageContent(
						defaultUserId,
						{
							pagination: {
								page: createUInt(1),
								podcastsPerPage: createUInt(5),
							},
						},
					);
					globalLogger.info(
						`[user] feed contents length=${contents.length}`,
					);
					for (let i = 0; i < contents.length; i++) {
						console.log(
							`${i + 1} ${JSON.stringify(contents[i])}`,
						);
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
