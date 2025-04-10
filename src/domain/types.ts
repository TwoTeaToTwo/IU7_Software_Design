import { z } from "zod";

const UIntSchema = z.number().int().nonnegative();
export type UInt = z.infer<typeof UIntSchema>;

export type Id = UInt;
export type CompareFunction<Type> = (a: Type, b: Type) => number;
export type PodcastStream = ReadableStream<Uint8Array<ArrayBuffer>>;
export type SearchPlatform = string;
export type StreamToolName = string;

export const INJECT_TYPES = {
	SearchStrategies: Symbol.for("SearchStrategies"),
	SearchService: Symbol.for("SearchService"),
	SubscribeRepository: Symbol.for("SubscribeRepository"),
	UserRepository: Symbol.for("UserRepository"),
	StreamStrategies: Symbol.for("StreamStrategies"),
	StreamService: Symbol.for("StreamService"),
	FeedService: Symbol.for("FeedService"),
};
