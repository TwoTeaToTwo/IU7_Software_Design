import { type Static, Type } from "@sinclair/typebox";

const searchPodcastByQuerySchema = Type.Object({
	query: Type.String(),
	page: Type.Integer({ minimum: 1 }),
	podcasts_per_page: Type.Integer({ minimum: 1 }),
});
const paginationSchema = Type.Object({
	page: Type.Integer({ minimum: 1 }),
	podcasts_per_page: Type.Integer({ minimum: 1 }),
	total_podcasts: Type.Integer({ minimum: 1 }),
});
export type SearchPodcastByQuery = Static<
	typeof searchPodcastByQuerySchema
>;
export const podcastSchema = Type.Object({
	title: Type.String(),
	platform: Type.String(),
	duration_s: Type.Integer({ minimum: 1 }),
	relevance: Type.String(),
	url: Type.String(),
});
const searchPodcastByURLSchema = Type.Object({ url: Type.String() });
export type SearchPodcastByURL = Static<typeof searchPodcastByURLSchema>;
export const searchPodcastsQuerySchema = Type.Partial(
	Type.Intersect([searchPodcastByQuerySchema, searchPodcastByURLSchema]),
);
export const searchPodcastsOkSchema = Type.Object({
	podcasts: Type.Array(podcastSchema),
	pagination: paginationSchema,
});
export const searchPodcastsNotFoundSchema = Type.String();
export const searchPodcastsErrorSchema = Type.String();
