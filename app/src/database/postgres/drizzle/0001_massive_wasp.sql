ALTER TABLE "user_have_subscriptions" DROP CONSTRAINT "user_fk";
--> statement-breakpoint
ALTER TABLE "user_have_subscriptions" DROP CONSTRAINT "subscription_fk";
--> statement-breakpoint
ALTER TABLE "user_have_subscriptions" DROP CONSTRAINT "user_have_subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_have_subscriptions" DROP CONSTRAINT "user_have_subscriptions_subscription_id_subscriptions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_have_subscriptions" ADD CONSTRAINT "user_have_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_have_subscriptions" ADD CONSTRAINT "user_have_subscriptions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;