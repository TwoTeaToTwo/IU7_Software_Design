import { Type } from "@sinclair/typebox";
import { subscribeObjectSchema } from "./channel.schemas.ts";

export const showUserSubscriptionsQuery = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	channels_per_page: Type.Integer({ minimum: 1 }),
});
const paginationSchema = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	channels_per_page: Type.Integer({ minimum: 1 }),
	total_podcasts: Type.Integer({ minimum: 1 }),
});
export const showUserSubscriptionsOkSchema = Type.Object({
	channels: Type.Array(subscribeObjectSchema),
	pagination: paginationSchema,
});
export const showUserSubscriptionsUserNotFoundSchema = Type.String();
