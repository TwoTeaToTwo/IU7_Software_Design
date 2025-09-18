import type { FastifyReply, FastifyRequest } from "fastify";

export class SPAController {
	private static readonly indexHTML = "index.html";

	public static loadIndex(
		_request: FastifyRequest,
		reply: FastifyReply,
	) {
		reply.sendFile(SPAController.indexHTML);
	}
}
