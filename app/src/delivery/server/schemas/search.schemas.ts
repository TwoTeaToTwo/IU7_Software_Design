import { type Static, Type } from "@sinclair/typebox";

export const searchPodcastByQuerySchema = Type.Object({
	query: Type.String(),
	max_results: Type.Integer({ minimum: 1 }),
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
export const searchPodcastByQueryOkSchema = Type.Array(podcastSchema);

export const searchPodcastByURLSchema = Type.Object({ url: Type.String() });
export type SearchPodcastByURL = Static<typeof searchPodcastByURLSchema>;
export const searchPodcastByURLOkSchema = podcastSchema;
export const searchPodcastByURLPodcastNotFoundSchema = Type.String();
export const searchPodcastByURLErrorSchema = Type.String();
