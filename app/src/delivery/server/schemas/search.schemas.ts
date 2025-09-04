import { type Static, Type } from "@sinclair/typebox";

export const searchPodcastByQuerySchema = Type.Object({query: Type.String(), max_results: Type.Integer({minimum: 1})});
export type searchPodcastByQueryType = Static<typeof searchPodcastByQuerySchema>;