import { domain } from '../Config.ts';

export interface SubscribeViewModel {
	id: number;
	url: string;
	title: string;
	platform: string;
}

export const getSubscriptions = async (
	accessToken: string
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
		console.log('[user] get user subscriptions error');
		return undefined;
		// TODO
	} else {
		const content = (await response.json()) as Array<SubscribeViewModel>;
		return content;
	}
};

export const unsubscribe = async (
	accessToken: string,
	channelId: number
): Promise<boolean | undefined> => {
	const responseURL = `${domain}/api/user/channel/unsubscribe?channel_id=${channelId}`;
	const response = await fetch(responseURL, {
		method: 'GET',
		headers: {
			Authorization: accessToken,
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		console.log('[user] get user unsubscribe error');
		return undefined;
		// TODO
	} else {
		const content = (await response.json()) as boolean;
		return content;
	}
};
