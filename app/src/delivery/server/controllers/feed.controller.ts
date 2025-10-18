import type { FastifyReply, FastifyRequest } from "fastify";
import type { FeedService, Podcast } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { createUInt, INJECT_TYPES, UserFindError } from "@podcast/core";
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
		const page = createUInt(query.page);
		const podcastsPerPage = createUInt(query.podcasts_per_page);
		const userId = request.user.id;
		let podcasts: Podcast[] = [];
		try {
			podcasts = await feedService.getFeedPageContent(userId, {
				pagination: { page, podcastsPerPage },
			});
		} catch (error) {
			if (error instanceof UserFindError) {
				return reply.status(404).send("User not found");
			}
		}
		return reply.status(200).send(podcasts);
	}
}
