import { type Static, Type } from "@sinclair/typebox";

export const searchPodcastByQuerySchema = Type.Object({
	query: Type.String(),
	max_results: Type.Integer({ minimum: 1 }),
});
export type SearchPodcastByQuery = Static<
	typeof searchPodcastByQuerySchema
>;

export const searchPodcastByURLSchema = Type.Object({ url: Type.String() });
export type SearchPodcastByURL = Static<typeof searchPodcastByURLSchema>;
