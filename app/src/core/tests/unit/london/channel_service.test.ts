import { assertEquals, assertRejects } from "@std/assert";
import { ChannelService, UserFindError } from "../../../mod.ts";
import { SubscribeMother, UserMother } from "../../object_mothers.ts";
import {
	SearchServiceMockBuilder,
	SubscribeManageRepositoryMockBuilder,
	SubscribeRepositoryMockBuilder,
	UserRepositoryMockBuilder,
} from "../../builders.ts";

const subscribeMother = new SubscribeMother();
const userMother = new UserMother();

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const user = userMother.createUser();

	const searchServiceBuilder = new SearchServiceMockBuilder();
	const searchPlatform = "youtube";
	searchServiceBuilder.produceIsChannelExist(true);
	searchServiceBuilder.produceGetPlatformByURL(searchPlatform);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceSubscribe(true);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const subscribeRepositoryBuilder = new SubscribeRepositoryMockBuilder();
	subscribeRepositoryBuilder.produceCreate(subscribe);
	const subscribeRepository = subscribeRepositoryBuilder
		.createSubscribeRepository();

	const userRepositoryBuilder = new UserRepositoryMockBuilder();
	userRepositoryBuilder.produceFindById(user);
	const userRepository = userRepositoryBuilder.createUserRepository();

	const channelService = new ChannelService(
		searchService,
		subscribeManageRepository,
		userRepository,
		subscribeRepository,
	);

	const result = await channelService.subscribe(
		user.id,
		subscribe.url,
		subscribe.title,
	);

	assertEquals(result, true);
});

Deno.test("ChannelService: subscribe: user doesn't exist, channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const user = userMother.createUser();

	const searchServiceBuilder = new SearchServiceMockBuilder();
	const searchPlatform = "youtube";
	searchServiceBuilder.produceIsChannelExist(true);
	searchServiceBuilder.produceGetPlatformByURL(searchPlatform);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceSubscribe(true);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const subscribeRepositoryBuilder = new SubscribeRepositoryMockBuilder();
	subscribeRepositoryBuilder.produceCreate(subscribe);
	const subscribeRepository = subscribeRepositoryBuilder
		.createSubscribeRepository();

	const userRepositoryBuilder = new UserRepositoryMockBuilder();
	userRepositoryBuilder.produceFindById(null);
	const userRepository = userRepositoryBuilder.createUserRepository();

	const channelService = new ChannelService(
		searchService,
		subscribeManageRepository,
		userRepository,
		subscribeRepository,
	);

	await assertRejects(async () => {
		await channelService.subscribe(
			user.id,
			subscribe.url,
			subscribe.title,
		);
	}, UserFindError);
});

Deno.test("ChannelService: unsubscribe: user exists, channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const user = userMother.createUser();

	const searchServiceBuilder = new SearchServiceMockBuilder();
	const searchPlatform = "youtube";
	searchServiceBuilder.produceIsChannelExist(true);
	searchServiceBuilder.produceGetPlatformByURL(searchPlatform);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceUnsubscribe(true);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const subscribeRepositoryBuilder = new SubscribeRepositoryMockBuilder();
	subscribeRepositoryBuilder.produceFindById(subscribe);
	subscribeRepositoryBuilder.produceDelete(true);
	const subscribeRepository = subscribeRepositoryBuilder
		.createSubscribeRepository();

	const userRepositoryBuilder = new UserRepositoryMockBuilder();
	userRepositoryBuilder.produceFindById(user);
	const userRepository = userRepositoryBuilder.createUserRepository();

	const channelService = new ChannelService(
		searchService,
		subscribeManageRepository,
		userRepository,
		subscribeRepository,
	);

	const result = await channelService.unsubscribe(
		user.id,
		subscribe.id,
	);

	assertEquals(result, true);
});

Deno.test("ChannelService: unsubscribe: user doesn't exist, channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe();
	const user = userMother.createUser();

	const searchServiceBuilder = new SearchServiceMockBuilder();
	const searchPlatform = "youtube";
	searchServiceBuilder.produceIsChannelExist(true);
	searchServiceBuilder.produceGetPlatformByURL(searchPlatform);
	const searchService = searchServiceBuilder.createSearchService();

	const subscribeManageRepositoryBuilder =
		new SubscribeManageRepositoryMockBuilder();
	subscribeManageRepositoryBuilder.produceUnsubscribe(true);
	const subscribeManageRepository = subscribeManageRepositoryBuilder
		.createSubscribeManageRepository();

	const subscribeRepositoryBuilder = new SubscribeRepositoryMockBuilder();
	subscribeRepositoryBuilder.produceFindById(subscribe);
	subscribeRepositoryBuilder.produceDelete(true);
	const subscribeRepository = subscribeRepositoryBuilder
		.createSubscribeRepository();

	const userRepositoryBuilder = new UserRepositoryMockBuilder();
	userRepositoryBuilder.produceFindById(null);
	const userRepository = userRepositoryBuilder.createUserRepository();

	const channelService = new ChannelService(
		searchService,
		subscribeManageRepository,
		userRepository,
		subscribeRepository,
	);

	await assertRejects(async () => {
		await channelService.unsubscribe(
			user.id,
			subscribe.id,
		);
	}, UserFindError);
});
