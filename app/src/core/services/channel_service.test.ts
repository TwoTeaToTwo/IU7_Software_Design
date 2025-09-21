import {
	ChannelService,
	createUInt,
	Id,
	Password,
	Subscribe,
	User,
} from "../mod.ts";
import type {
	ISubscribeManageRepository,
	ISubscribeRepository,
	IUserRepository,
	SearchService,
} from "../mod.ts";
import {
	anyNumber,
	anyOfClass,
	anyString,
	instance,
	mock,
	when,
} from "ts-mockito";
import { assertEquals } from "@std/assert";

Deno.test("ChannelService: subscribe: user exists, channel exists", async () => {
	const mock_search = mock<SearchService>();
	const y_platform = "youtube";
	when(mock_search.isChannelExist(anyOfClass(URL))).thenResolve(true);
	when(mock_search.getPlatformByURL(anyOfClass(URL))).thenReturn(y_platform);
	const searcher = instance(mock_search);

	const mock_user_repo = mock<IUserRepository>();
	const user_id = createUInt(1);
	const user = new User(user_id, "test", new Password("1234"));
	when(mock_user_repo.findById(user_id)).thenResolve(user);
	const user_repo = instance(mock_user_repo);

	const mock_subscribe_repo = mock<ISubscribeRepository>();
	const channel_url = new URL("https://www.youtube.com/@MrVrschool");
	const channel_name = "Red 21";
	const subscribe = new Subscribe(
		createUInt(1),
		channel_url,
		channel_name,
		y_platform,
	);
	when(mock_subscribe_repo.create(anyOfClass(URL), anyString(), anyString()))
		.thenResolve(subscribe);
	const subscribe_repo = instance(mock_subscribe_repo);

	const mock_subscribe_manage_repo = mock<ISubscribeManageRepository>();
	when(
		mock_subscribe_manage_repo.subscribe(
			anyNumber(),
			anyNumber(),
		),
	)
		.thenResolve(true);
	const subscribe_manage_repo = instance(mock_subscribe_manage_repo);

	const channel_service = new ChannelService(
		searcher,
		subscribe_manage_repo,
		user_repo,
		subscribe_repo,
	);
	const result = await channel_service.subscribe(
		user_id,
		channel_url,
		channel_name,
	);
	assertEquals(result, true);
});
