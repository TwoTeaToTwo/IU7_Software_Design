import { assertEquals } from "@std/assert";
import { ChannelServiceFactory } from "./factories.ts";
import type { ChannelService } from "../../../mod.ts";
import { SubscribeMother, UserMother } from "../../object_mothers.ts";

let channelService: ChannelService;
const subscribeMother = new SubscribeMother();
const userMother = new UserMother();

Deno.test.beforeEach(async () => {
	const channelServiceFactory = new ChannelServiceFactory();
	channelService = await channelServiceFactory.createChannelService();
});

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	const user = userMother.createUser();
	const subscribe = subscribeMother.createInMemorySubscribe();

	const result = await channelService.subscribe(
		user.id,
		subscribe.url,
		subscribe.title,
	);

	assertEquals(result, true);
});
