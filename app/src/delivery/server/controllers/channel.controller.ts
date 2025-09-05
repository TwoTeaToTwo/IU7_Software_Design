import type { FastifyReply, FastifyRequest } from "fastify";
import type { ChannelService, Podcast, SearchService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import {
	createUInt,
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	UnknownPlatformError,
} from "@podcast/core";
import type { subscribeType } from "../schemas/channel.schemas.ts";

export class ChannelController {
	public static async subscribe(
		request: FastifyRequest<{ Querystring: subscribeType }>,
		reply: FastifyReply,
	) {
		// const searchService = container.get<SearchService>(
		// 	INJECT_TYPES.SearchService,
		// );
		// const query = request.query.query;
		// const max_results = request.query.max_results;
		// const podcasts = await searchService.searchPodcast(
		// 	query,
		// 	createUInt(max_results),
		// );
		// return reply.status(200).send(podcasts);
	}
}
