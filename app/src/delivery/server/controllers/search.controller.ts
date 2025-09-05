import type { FastifyReply, FastifyRequest } from "fastify";
import type { Podcast, SearchService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import {
	createUInt,
	GetPodcastError,
	GetSearcherError,
	INJECT_TYPES,
	UnknownPlatformError,
} from "@podcast/core";
import type {
	SearchPodcastByQuery,
	SearchPodcastByURL,
} from "../schemas/search.schemas.ts";

export class SearchController {
	public static async searchPodcastByQuery(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const searchService = container.get<SearchService>(
			INJECT_TYPES.SearchService,
		);
		const requestQuery = request.query as SearchPodcastByQuery;
		const query = requestQuery.query;
		const max_results = requestQuery.max_results;
		const podcasts = await searchService.searchPodcast(
			query,
			createUInt(max_results),
		);
		return reply.status(200).send(podcasts);
	}

	public static async searchPodcastByURL(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const searchService = container.get<SearchService>(
			INJECT_TYPES.SearchService,
		);
		const requestQuery = request.query as SearchPodcastByURL;
		const url = requestQuery.url;
		let podcast: Podcast | undefined;
		try {
			podcast = await searchService.searchByURL(new URL(url));
		} catch (error) {
			if (
				error instanceof UnknownPlatformError ||
				error instanceof GetSearcherError
			) {
				return reply.status(400).send(
					"Unsupported podcast source platform",
				);
			} else if (error instanceof GetPodcastError) {
				return reply.status(404).send(
					"Podcast not found",
				);
			}
		}
		if (!podcast) {
			return reply.status(404).send(
				"Podcast not found",
			);
		}
		return reply.status(200).send(podcast);
	}
}
