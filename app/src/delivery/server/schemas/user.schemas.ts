import { Type } from "@sinclair/typebox";
import { subscribeObjectSchema } from "./channel.schemas.ts";

export const showUserSubscriptionsOkSchema = Type.Array(subscribeObjectSchema);

export const showUserSubscriptionsUserNotFoundSchema = Type.String();
