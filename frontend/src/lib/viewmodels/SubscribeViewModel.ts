import { api, domain } from "../Config.ts";
import type { ErrorHandler } from "../types.ts";
import { browser } from "$app/environment";

export interface SubscribeViewModel {
	id: number;
	url: string;
	title: string;
	platform: string;
}

interface GetSubscriptionsResponse {
	channels: Array<SubscribeViewModel>;
	pagination: {
		page: number;
		channels_per_page: number;
		total_podcasts: number;
	};
}

export const getSubscriptions = async (
	accessToken: string,
	errorHandler: ErrorHandler,
): Promise<Array<SubscribeViewModel> | undefined> => {
	if (browser) {
		const responseURL =
			`${domain}/${api}/users/channels?page=1&channels_per_page=100`;
		const response = await fetch(responseURL, {
			method: "GET",
			headers: {
				Authorization: accessToken,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			errorHandler("Can't get subscriptions");
			return undefined;
		} else {
			const { channels } =
				(await response.json()) as GetSubscriptionsResponse;
			return channels;
		}
	}
};

export const unsubscribe = async (
	accessToken: string,
	channelId: number,
	errorHandler: ErrorHandler,
): Promise<boolean | undefined> => {
	if (browser) {
		const responseURL = `${domain}/${api}/users/channels/${channelId}`;
		try {
			const response = await fetch(responseURL, {
				method: "DELETE",
				headers: {
					Authorization: accessToken,
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				errorHandler("Can't unsubscribe");
				return undefined;
			} else {
				const content = (await response.json()) as boolean;
				return content;
			}
		} catch {
			errorHandler("Can't unsubscribe");
			return undefined;
		}
	}
};

export const subscribe = async (
	accessToken: string,
	title: string,
	url: string,
	errorHandler: ErrorHandler,
): Promise<SubscribeViewModel | undefined> => {
	if (browser) {
		const responseURL =
			`${domain}/${api}/users/channels?channel_title=${title}&channel_url=${url}`;
		try {
			const response = await fetch(responseURL, {
				method: "POST",
				headers: {
					Authorization: accessToken,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					channel_title: title,
					channel_url: url,
				}),
			});
			if (!response.ok) {
				errorHandler("Can't subscribe!");
				return undefined;
			} else {
				const content = (await response.json()) as SubscribeViewModel;
				return content;
			}
		} catch {
			errorHandler("Can't subscribe!");
			return undefined;
		}
	}
};
