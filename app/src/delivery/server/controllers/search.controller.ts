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
	SearchPodcastsQueryType,
} from "../schemas/search.schemas.ts";

export class SearchController {
	public static async searchPodcasts(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const requestQuery = request.query as SearchPodcastsQueryType;
		if (
			requestQuery.page && requestQuery.podcasts_per_page &&
			requestQuery.query
		) {
			await SearchController.searchPodcastByQuery(
				{
					page: requestQuery.page,
					podcasts_per_page: requestQuery.podcasts_per_page,
					query: requestQuery.query,
				},
				request,
				reply,
			);
		} else if (requestQuery.url) {
			await SearchController.searchPodcastByURL(requestQuery.url, reply);
		} else {
			return reply.status(401).send(
				"Wrong api call",
			);
		}
	}

	private static async searchPodcastByQuery(
		requestQuery: SearchPodcastByQuery,
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const searchService = container().get<SearchService>(
			INJECT_TYPES.SearchService,
		);
		const query = requestQuery.query;
		const page = createUInt(requestQuery.page);
		const podcastsPerPage = createUInt(requestQuery.podcasts_per_page);
		const userId = request.user.id;
		const podcasts = await searchService.searchPodcast(
			userId,
			query,
			{ pagination: { page, podcastsPerPage } },
		);
		return reply.status(200).send(podcasts);
	}

	private static async searchPodcastByURL(
		url: string,
		reply: FastifyReply,
	) {
		const searchService = container().get<SearchService>(
			INJECT_TYPES.SearchService,
		);
		let podcast: Podcast | undefined;
		try {
			podcast = await searchService.searchByURL(new URL(url));
		} catch (error) {
			if (
				error instanceof UnknownPlatformError ||
				error instanceof GetSearcherError
			) {
				return reply.status(401).send(
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
		return reply.status(200).send([podcast]);
	}
}
