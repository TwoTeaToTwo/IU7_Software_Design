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
export const unsubscribeErrorSchema = Type.String();

export const getSubscriptionQuerySchema = Type.Object({
	subscribe_id: Type.Integer({ minimum: 1 }),
});
export const getSubscriptionOkSchema = subscribeObjectSchema;
export const getSubscriptionErrorSchema = Type.String();

export const updateSubscriptionSchema = subscribeObjectSchema;
export const updateSubscriptionCreatedSchema = subscribeObjectSchema;
export const updateSubscriptionErrorSchema = Type.String();

export const updateSubscriptionTitleSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
	title: Type.String(),
});
export const updateSubscriptionTitleErrorSchema = Type.String();
