<script lang="ts">
	import Search from './Search.svelte';
	import { FeedViewModel } from '$lib/viewmodels/feed/FeedViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from '../Podcast.svelte';
	import { playingPodcast } from '../../stores/Store';
	import Player from '../Player.svelte';
	import SubscriptionsPanel from './SubscriptionsPanel.svelte';

	const feedContent = $state(new Array<PodcastViewModel>());
	// const feedSize = 10;
	// Добавить кнопку получить и убрать код снизу
	// $effect(() => {
	// 	authController.getAccessToken().then((accessToken) => {
	// 		FeedViewModel.getFeedContent(feedSize, accessToken!, feedContent).then(() => {
	// 			console.log('feed is updated;');
	// 		});
	// 	});
	// });
	const podcast1: PodcastViewModel = {
		title: 'Meow meow meow meow meow meow meow meow meow meow meow meow meow meow',
		platform: 'youtube',
		duration_s: 94,
		relevance: 'test',
		url: 'https://youtu.be/AtPrjYp75uA?si=K2VGXcbtTGhTXdjc',
		durationText: '1:34',
		relevanceText: '4 Feb, 2024'
	};
	const podcast2: PodcastViewModel = {
		title: 'Wow',
		platform: 'youtube',
		duration_s: 4,
		relevance: 'test',
		url: 'https://youtu.be/BnTdfA5aTpY?si=Z7JWNB43D6g13NZC',
		durationText: '0:04',
		relevanceText: '15 Feb, 2023'
	};
	feedContent.push(podcast1);
	feedContent.push(podcast2);
</script>

<SubscriptionsPanel />
<div class="container">
	<div class="search">
		<Search />
	</div>
	<div class="feed-content">
		{#each feedContent as podcast}
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
		{/each}
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
