import { api, domain } from "../Config.ts";
import { browser } from "$app/environment";

export const getPodcastStream = async (
	accessToken: string,
	url: string,
): Promise<string | undefined> => {
	if (browser) {
		const responseURL = `${domain}/${api}/streams?url=${url}`;
		const response = await fetch(responseURL, {
			method: "GET",
			headers: {
				Authorization: accessToken,
				"Content-Type": "audio/mpeg",
			},
		});
		if (!response.ok) {
			return undefined;
		} else {
			const buffer = await response.clone().arrayBuffer();
			const contentType = response.headers.get("Content-Type") ||
				"audio/mpeg";
			const blob = new Blob([buffer], { type: contentType });
			const audioUrl = URL.createObjectURL(blob);
			return audioUrl;
		}
	}
};
