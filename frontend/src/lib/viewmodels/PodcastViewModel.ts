export interface PodcastViewModel {
	title: string;
	platform: string;
	duration_s: number;
	relevance: string;
	url: string;
	durationText?: string;
	relevanceText?: string;
}

export const durationSecondsToText = (duration_s: number): string => {
	const seconds = duration_s;
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	if (hours > 0) {
		return [
			hours.toString().padStart(2, '0'),
			minutes.toString().padStart(2, '0'),
			secs.toString().padStart(2, '0')
		].join(':');
	} else {
		return [minutes.toString().padStart(2, '0'), secs.toString().padStart(2, '0')].join(':');
	}
};

export const relevanceToText = (relevance: Date): string => {
	return Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(relevance);
};
