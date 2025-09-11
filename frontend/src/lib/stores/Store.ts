import { writable } from 'svelte/store';
import { PodcastViewModel } from '../viewmodels/PodcastViewModel.ts';

export const playingPodcast = writable<PodcastViewModel | undefined>(undefined);

playingPodcast.subscribe((value) => {
	console.log(`${value?.title} is playing`);
});
