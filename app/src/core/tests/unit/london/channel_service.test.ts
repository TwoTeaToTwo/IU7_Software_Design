import { assertEquals, assertRejects } from "@std/assert";
import { ChannelService, UserFindError } from "../../../mod.ts";
import {
	SearchServiceMockMother,
	SubscribeManageRepositoryMockMother,
	SubscribeMother,
	SubscribeRepositoryMockMother,
	UserMother,
	UserRepositoryMockMother,
} from "../../object_mothers.ts";

const searchServiceMother = new SearchServiceMockMother();
const subscribeMother = new SubscribeMother();
const subscribeManageRepositoryMother =
	new SubscribeManageRepositoryMockMother();
const subscribeRepositoryMother = new SubscribeRepositoryMockMother();
const userRepositoryMother = new UserRepositoryMockMother();
const userMother = new UserMother();

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const user = userMother.createUser({});
	const searchService = searchServiceMother.createYoutubeSearchService({});
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({ _subscribes: subscribes });
	const subscribeRepository = subscribeRepositoryMother
		.createSubscribeRepository({ _subscribe: subscribe });
	const userRepository = userRepositoryMother.createUserRepository({
		_user: user,
	});
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
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const user = userMother.createUser({});
	const searchService = searchServiceMother.createYoutubeSearchService({});
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({ _subscribes: subscribes });
	const subscribeRepository = subscribeRepositoryMother
		.createSubscribeRepository({ _subscribe: subscribe });
	const userRepository = userRepositoryMother.createUserRepository({
		_user: user,
		canFindUser: false,
	});
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
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const user = userMother.createUser({});
	const searchService = searchServiceMother.createYoutubeSearchService({});
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({ _subscribes: subscribes });
	const subscribeRepository = subscribeRepositoryMother
		.createSubscribeRepository({ _subscribe: subscribe });
	const userRepository = userRepositoryMother.createUserRepository({
		_user: user,
	});
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
	const subscribe = subscribeMother.createYoutubeSubscribe({});
	const subscribes = [subscribe];
	const user = userMother.createUser({});
	const searchService = searchServiceMother.createYoutubeSearchService({});
	const subscribeManageRepository = subscribeManageRepositoryMother
		.createSubscribeManageRepository({ _subscribes: subscribes });
	const subscribeRepository = subscribeRepositoryMother
		.createSubscribeRepository({ _subscribe: subscribe });
	const userRepository = userRepositoryMother.createUserRepository({
		_user: user,
		canFindUser: false,
	});
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
