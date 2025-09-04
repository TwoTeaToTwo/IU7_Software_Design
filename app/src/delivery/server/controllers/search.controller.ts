import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { FastifyJWT } from "@fastify/jwt";
import type { SearchService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import { INJECT_TYPES, createUInt } from "@podcast/core";
import type { loginType } from "../schemas/auth.schemas.ts";
import { httpConfig } from "../config.ts";
import type { UserPayload } from "../types.ts";
import type {searchPodcastByQueryType} from "../schemas/search.schemas.ts";


class SearchController
{
    public static async searchPodcastByQuery(request: FastifyRequest<{ Body: searchPodcastByQueryType }>,
		reply: FastifyReply)
        {
            const searchService = container.get<SearchService>(INJECT_TYPES.SearchService);
            const query = request.body.query;
            const max_results = request.body.max_results;
            const podcasts = searchService.searchPodcast(query, createUInt(max_results));
            
        }
}