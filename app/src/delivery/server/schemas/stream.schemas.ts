import { type Static, Type } from "@sinclair/typebox";

export const streamPodcastSchema = Type.Object({
	url: Type.String(),
});
export type StreamPodcastType = Static<
	typeof streamPodcastSchema
>;
