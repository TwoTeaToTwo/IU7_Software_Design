import { domain } from '../Config.ts';
import { errorHandler } from '../types.ts';

export interface SubscribeViewModel {
	id: number;
	url: string;
	title: string;
	platform: string;
}

export const getSubscriptions = async (
	accessToken: string,
	errorHandler: errorHandler
): Promise<Array<SubscribeViewModel> | undefined> => {
	const responseURL = `${domain}/api/user/subscriptions`;
	const response = await fetch(responseURL, {
		method: 'GET',
		headers: {
			Authorization: accessToken,
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		errorHandler("Can't get subscriptions");
		return undefined;
	} else {
		const content = (await response.json()) as Array<SubscribeViewModel>;
		return content;
	}
};

export const unsubscribe = async (
	accessToken: string,
	channelId: number,
	errorHandler: errorHandler
): Promise<boolean | undefined> => {
	const responseURL = `${domain}/api/user/channel/unsubscribe?channel_id=${channelId}`;
	try {
		const response = await fetch(responseURL, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			}
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
};

export const subscribe = async (
	accessToken: string,
	title: string,
	url: string,
	errorHandler: errorHandler
): Promise<SubscribeViewModel | undefined> => {
	const responseURL = `${domain}/api/user/channel/subscribe?channel_title=${title}&channel_url=${url}`;
	try {
		const response = await fetch(responseURL, {
			method: 'GET',
			headers: {
				Authorization: accessToken,
				'Content-Type': 'application/json'
			}
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
};
