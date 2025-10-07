import type { FastifyReply, FastifyRequest } from "fastify";
import type { FeedService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { INJECT_TYPES, UserFindError } from "@podcast/core";
import type { GetFeedContentType } from "../schemas/feed.schemas.ts";

export class FeedController {
	public static async getFeedContent(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const feedService = container().get<FeedService>(
			INJECT_TYPES.FeedService,
		);
		const query = request.query as GetFeedContentType;
		const feedSize = query.feed_size;
		const userID = request.user.id;
		const feed = feedService.createFeed(userID, feedSize);
		try {
			await feedService.updateFeed(feed);
		} catch (error) {
			if (error instanceof UserFindError) {
				return reply.status(404).send("User not found");
			}
		}
		return reply.status(200).send(feed.contents);
	}
}
