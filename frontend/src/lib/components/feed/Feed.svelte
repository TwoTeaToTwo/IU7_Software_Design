<script lang="ts">
	import Search from './Search.svelte';
	import { FeedViewModel } from '$lib/viewmodels/feed/FeedViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from '../Podcast.svelte';
	import { playingPodcast } from '../../stores/Store';
	import Player from '../Player.svelte';

	// const feedContent = $state(new Array<PodcastViewModel>());
	// const feedSize = 10;
	// $effect(() => {
	// 	authController.getAccessToken().then((accessToken) => {
	// 		FeedViewModel.getFeedContent(feedSize, accessToken!, feedContent).then(() => {
	// 			console.log('feed is updated;');
	// 		});
	// 	});
	// });
	const podcast: PodcastViewModel = {
		title: 'Persona 3 - Burn My Dread',
		platform: 'youtube',
		duration_s: 278,
		relevance: 'test',
		url: 'https://youtu.be/GpIq-YDGP5U?si=4RhCNRmOzdVgDmib',
		durationText: '4:38',
		relevanceText: '4 Feb, 2024'
	};
</script>

<div class="container">
	<div class="search">
		<Search />
	</div>
	<div class="feed-content">
		<!-- {#each feedContent as podcast}
			<Podcast
				title={podcast.title}
				channel=""
				platform={podcast.platform}
				relevance={podcast.relevanceText}
				duration={podcast.durationText}
				isSelected={$playingPodcast?.url === podcast.url}
				clickHandler={() => {
					$playingPodcast = podcast;
				}}
			></Podcast>
		{/each} -->
		<Podcast
			title={podcast.title}
			channel=""
			platform={podcast.platform}
			relevance={podcast.relevanceText}
			duration={podcast.durationText}
			isSelected={$playingPodcast?.url === podcast.url}
			clickHandler={() => {
				$playingPodcast = podcast;
			}}
		></Podcast>
	</div>
	{#if $playingPodcast !== undefined}
		<div class="player">
			<Player />
		</div>
	{/if}
</div>

<style>
	.search {
		margin-top: 20px;
		margin-bottom: auto;
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		flex-direction: column;
		gap: 40px;
	}

	.feed-content {
		display: flex;
		justify-content: flex-start;
		height: 550px;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		align-items: center;
		margin-top: 260px;
		margin-bottom: auto;
	}

	.player {
		margin-top: auto;
		margin-bottom: 20px;
	}
</style>
