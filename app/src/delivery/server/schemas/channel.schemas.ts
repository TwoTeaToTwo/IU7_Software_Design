import { type Static, Type } from "@sinclair/typebox";

export const subscribeObjectSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
	url: Type.String(),
	title: Type.String(),
	platform: Type.String(),
});

export const subscribeSchema = Type.Object({
	channel_title: Type.String(),
	channel_url: Type.String(),
});
export type SubscribeType = Static<
	typeof subscribeSchema
>;
export const subscribeOkSchema = subscribeObjectSchema;
export const subscribeErrorSchema = Type.String();

export const unsubscribeSchema = Type.Object({
	channel_id: Type.Integer({ minimum: 1 }),
});
export type UnsubscribeType = Static<
	typeof unsubscribeSchema
>;
