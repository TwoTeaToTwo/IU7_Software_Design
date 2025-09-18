import { type Static, Type } from "@sinclair/typebox";

export const getFeedContentSchema = Type.Object({
	feed_size: Type.Optional(Type.Integer({ minimum: 1 })),
});
export type GetFeedContentType = Static<
	typeof getFeedContentSchema
>;
