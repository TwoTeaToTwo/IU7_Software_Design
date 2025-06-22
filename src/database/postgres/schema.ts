import {
	foreignKey,
	integer,
	pgTable,
	serial,
	text,
} from "npm:drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	login: text().notNull().unique(),
	password: text().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	url: text("url").notNull().unique(),
	title: text("title").notNull(),
	platform: text("platform").notNull(),
});

export const usersHaveSubscriptions = pgTable("user_have_subscriptions", {
	id: serial("id").primaryKey(),
	user_id: integer("user_id").references(() => users.id).notNull(),
	subscription_id: integer("subscription_id").references(() =>
		subscriptions.id
	).notNull(),
}, (table) => [
	foreignKey({
		name: "user_fk",
		columns: [table.user_id],
		foreignColumns: [users.id],
	}).onDelete("cascade"),
	foreignKey({
		name: "subscription_fk",
		columns: [table.subscription_id],
		foreignColumns: [subscriptions.id],
	}).onDelete("cascade"),
]);
