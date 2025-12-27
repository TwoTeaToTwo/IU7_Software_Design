import { type Static, Type } from "@sinclair/typebox";
import { subscribeObjectSchema } from "./channel.schemas.ts";

export const showUserSubscriptionsQuery = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	channels_per_page: Type.Integer({ minimum: 1 }),
});
export type ShowUserSubscriptionsType = Static<
	typeof showUserSubscriptionsQuery
>;

const paginationSchema = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	channels_per_page: Type.Integer({ minimum: 1 }),
	total_channels: Type.Integer({ minimum: 1 }),
});
export const showUserSubscriptionsOkSchema = Type.Object({
	channels: Type.Array(subscribeObjectSchema),
	pagination: paginationSchema,
});
export const showUserSubscriptionsUserNotFoundSchema = Type.String();
