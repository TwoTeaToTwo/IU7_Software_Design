import { type Static, Type } from "@sinclair/typebox";
import { podcastSchema } from "./search.schemas.ts";

export const getFeedContentSchema = Type.Object({
	feed_size: Type.Optional(Type.Integer({ minimum: 1 })),
});
export type GetFeedContentType = Static<
	typeof getFeedContentSchema
>;
export const getFeedContentOkSchema = Type.Array(podcastSchema);
export const getFeedContentErrorSchema = Type.String();
