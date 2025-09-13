<script lang="ts">
	import Search from './Search.svelte';
	import { FeedViewModel } from '$lib/viewmodels/feed/FeedViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from '../Podcast.svelte';
	import { playingPodcast } from '../../stores/Store';
	import Player from '../Player.svelte';
	import SubscriptionsPanel from './SubscriptionsPanel.svelte';
	import Bubbles from '../Bubbles.svelte';
	import PopUp from '../PopUp.svelte';

	let showMessage = $state(false);
	let popUpMessage = $state('');
	let messageTitle = $state('');
	const messageHandler = (msg: string, title: string) => {
		messageTitle = title;
		popUpMessage = msg;
		showMessage = true;
		setTimeout(() => {
			showMessage = false;
		}, 2000);
	};

	let feedContent = $state(new Array<PodcastViewModel>());
	let isUpdateButtonHovered = $state(false);
	const feedSize = 10;
	const updateFeed = () => {
			messageHandler("Updating feed", "FEED");
			authController.getAccessToken().then((accessToken) => {
			FeedViewModel.getFeedContent(feedSize, accessToken!, feedContent).then(() => {
				messageHandler("Feed is updated!", "FEED");
			});
		});
	}
</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle} />
<Bubbles />
<SubscriptionsPanel />
<div class="container">
	<div class="search">
		<Search />
	</div>
	<button class="button_component" onclick={() => updateFeed()} onmouseenter={() => isUpdateButtonHovered = true} onmouseleave={() => isUpdateButtonHovered = false}
>{isUpdateButtonHovered ? "Update Feed" : "Feed"}</button>
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
		flex-direction: column;
		gap: 40px;
		height: 100vh;
	}

	.feed-content {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		align-items: center;
		margin-top: 0;
		margin-bottom: auto;
	}

	.player {
		margin-top: auto;
		margin-bottom: 20px;
	}

	.button_component {
		color: #ffffff;
		font-family: 'Nunito Sans', sans-serif;
		font-size: 72pt;
		font-weight: bold;
		margin-top: 0;
		margin-bottom: auto;
		position: relative;
		background: none;
		border: none;
		transition: all 0.2s ease;
	}

	.button_component:hover {
		font-size: 80pt;
	}

	.button_component:active {
		color: #00ccfe;
	}
</style>
