import { relations } from "npm:drizzle-orm";
import { subscriptions, users, usersHaveSubscriptions } from "./schema.ts";

export const userRelations = relations(users, ({ many }) => ({
	subscriptions: many(usersHaveSubscriptions),
}));

export const subscriptionRelations = relations(subscriptions, ({ many }) => ({
	users: many(usersHaveSubscriptions),
}));

export const userHaveSubscriptionRelations = relations(
	usersHaveSubscriptions,
	({ one }) => ({
		user: one(users, {
			fields: [usersHaveSubscriptions.user_id],
			references: [users.id],
		}),
		subscription: one(subscriptions, {
			fields: [usersHaveSubscriptions.subscription_id],
			references: [subscriptions.id],
		}),
	}),
);
