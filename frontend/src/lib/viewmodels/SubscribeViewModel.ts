import { domain } from "../Config.ts";

export interface SubscribeViewModel {
	id: number;
	url: string;
	title: string;
	platform: string;
}

export const getSubscriptions = async (
	accessToken: string,
): Promise<Array<SubscribeViewModel> | undefined> => {
	const responseURL = `${domain}/api/user/subscriptions`;
	const response = await fetch(responseURL, {
		method: "GET",
		headers: {
			Authorization: accessToken,
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		return undefined;
	} else {
		const content = (await response.json()) as Array<SubscribeViewModel>;
		return content;
	}
};

export const unsubscribe = async (
	accessToken: string,
	channelId: number,
): Promise<boolean | undefined> => {
	const responseURL =
		`${domain}/api/user/channel/unsubscribe?channel_id=${channelId}`;
	const response = await fetch(responseURL, {
		method: "GET",
		headers: {
			Authorization: accessToken,
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		return undefined;
	} else {
		const content = (await response.json()) as boolean;
		return content;
	}
};

export const subscribe = async (
	accessToken: string,
	title: string,
	url: string,
): Promise<SubscribeViewModel | undefined> => {
	const responseURL =
		`${domain}/api/user/channel/subscribe?channel_title=${title}&channel_url=${url}`;
	const response = await fetch(responseURL, {
		method: "GET",
		headers: {
			Authorization: accessToken,
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		return undefined;
	} else {
		const content = await response.json() as SubscribeViewModel;
		return content;
	}
};
