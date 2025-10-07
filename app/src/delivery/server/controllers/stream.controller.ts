import type { FastifyReply, FastifyRequest } from "fastify";
import type { IPodcastStream, StreamService } from "@podcast/core";
import { container } from "@podcast/infrastructure";
import {
	GetStreamerError,
	INJECT_TYPES,
	PodcastStreamError,
} from "@podcast/core";
import type { StreamPodcastType } from "../schemas/stream.schemas.ts";

export class StreamController {
	public static async streamPodcast(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const streamService = container().get<StreamService>(
			INJECT_TYPES.StreamService,
		);
		const query = request.query as StreamPodcastType;
		const url = new URL(query.url);
		let stream: IPodcastStream | undefined;
		try {
			stream = await streamService.streamPodcast(url);
		} catch (error) {
			if (error instanceof GetStreamerError) {
				return reply.status(400).send(
					"Unsupported podcast source platform",
				);
			} else if (error instanceof PodcastStreamError) {
				return reply.status(500).send(
					"Podcast stream error",
				);
			}
		}
		reply.raw.on("finish", () => {
			stream?.close();
		});
		reply.raw.on("close", () => {
			stream?.close();
		});
		return reply.status(200).headers({ "content-type": "audio/mpeg" }).send(
			stream?.getStream(),
		);
	}
}
