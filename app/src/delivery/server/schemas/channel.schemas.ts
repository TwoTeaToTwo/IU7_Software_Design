import { type Static, Type } from "@sinclair/typebox";

export const subscribeSchema = Type.Object({
	channel_title: Type.String(),
	channel_url: Type.String(),
});

export type subscribeType = Static<
	typeof subscribeSchema
>;
