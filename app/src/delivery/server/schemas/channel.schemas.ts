import { type Static, Type } from "@sinclair/typebox";

export const subscribeObjectSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
	url: Type.String(),
	title: Type.String(),
	platform: Type.String(),
});

export const subscribeObjectBodySchema = Type.Object({
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

export const unsubscribeParamsSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
});
export type UnsubscribeType = Static<
	typeof unsubscribeParamsSchema
>;
export const unsubscribeErrorSchema = Type.String();

export const getSubscriptionSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
});
export type GetSubscriptionType = Static<typeof getSubscriptionSchema>;
export const getSubscriptionOkSchema = subscribeObjectSchema;
export const getSubscriptionErrorSchema = Type.String();

export const updateSubscriptionParamsSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
});
export type UpdateSubscriptionParamsType = Static<
	typeof updateSubscriptionParamsSchema
>;
export const updateSubscriptionBodySchema = subscribeObjectBodySchema;
export type UpdateSubscriptionBodyType = Static<
	typeof updateSubscriptionBodySchema
>;
export const updateSubscriptionCreatedSchema = subscribeObjectSchema;
export const updateSubscriptionErrorSchema = Type.String();

export const updateSubscriptionTitleParamsSchema = Type.Object({
	id: Type.Integer({ minimum: 1 }),
});
export type UpdateSubscriptionTitleParamsType = Static<
	typeof updateSubscriptionTitleParamsSchema
>;
export const updateSubscriptionTitleBodySchema = Type.Object({
	title: Type.String(),
});
export type UpdateSubscriptionTitleBodyType = Static<
	typeof updateSubscriptionTitleBodySchema
>;
export const updateSubscriptionTitleResponseSchema = subscribeObjectSchema;
export const updateSubscriptionTitleErrorSchema = Type.String();
