import { type Static, Type } from "@sinclair/typebox";
import { podcastSchema } from "./search.schemas.ts";

export const getFeedContentSchema = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	podcasts_per_page: Type.Integer({ minimum: 1 }),
});
export type GetFeedContentType = Static<
	typeof getFeedContentSchema
>;
const paginationSchema = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	podcasts_per_page: Type.Integer({ minimum: 1 }),
	total_podcasts: Type.Integer({ minimum: 1 }),
});
export const getFeedContentOkSchema = Type.Object({
	podcasts: Type.Array(podcastSchema),
	pagination: paginationSchema,
});
export const getFeedContentErrorSchema = Type.String();
