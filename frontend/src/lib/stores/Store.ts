import { writable } from 'svelte/store';
import { PodcastViewModel } from '../viewmodels/PodcastViewModel.ts';

export const playingPodcast = writable<PodcastViewModel | undefined>(undefined);
