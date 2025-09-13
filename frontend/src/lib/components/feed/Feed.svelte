<script lang="ts">
	import Search from './Search.svelte';
	import { getFeedContent } from '$lib/viewmodels/feed/FeedViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from '../Podcast.svelte';
	import { playingPodcast } from '../../stores/Store';
	import Player from '../Player.svelte';
	import SubscriptionsPanel from './SubscriptionsPanel.svelte';
	import Bubbles from '../Bubbles.svelte';
	import PopUp from '../PopUp.svelte';
	import { searchPodcast } from '$lib/viewmodels/SearchViewModel';
	// Pop up messages
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
	const errorHandler = (msg: string) => {
		messageHandler(msg, 'ERROR');
	};
	// Variables
	let isContentLoading = $state(false);
	let feedContent = $state(new Array<PodcastViewModel>());
	let isUpdateButtonHovered = $state(false);
	let isSearching = $state(false);
	let searchQuery = $state('');
	const feedSize = 10;
	const maxResults = 5;
	// Functions
	const updateFeed = () => {
		isSearching = false;
		isContentLoading = true;
		messageHandler('Updating feed', 'FEED');
		authController.getAccessToken().then((accessToken) => {
			getFeedContent(feedSize, accessToken!, errorHandler).then((podcasts) => {
				isContentLoading = false;
				if (podcasts) {
					feedContent = podcasts;
					messageHandler('Feed is updated!', 'FEED');
				}
			});
		});
	};
	const searchHandler = (): void => {
		isSearching = true;
		isContentLoading = true;
		authController.getAccessToken().then((accessToken) => {
			searchPodcast(searchQuery, maxResults, accessToken!, messageHandler).then((podcasts) => {
				isContentLoading = false;
				if (podcasts) {
					feedContent = podcasts;
				}
			});
		});
	};
	const getContentTitle = (): string => {
		let contentTitle = '';
		if (!isSearching) {
			contentTitle = isUpdateButtonHovered ? 'Update Feed' : 'Feed';
		} else {
			contentTitle = isUpdateButtonHovered ? 'Return Feed' : 'Search';
		}
		return contentTitle;
	};
</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle} />
<Bubbles />
<SubscriptionsPanel />
<div class="container">
	<div class="search">
		<Search bind:value={searchQuery} />
		<button class="button-search" aria-label="close" onclick={() => searchHandler()}></button>
	</div>
	<button
		class="button_component"
		onclick={() => updateFeed()}
		onmouseenter={() => (isUpdateButtonHovered = true)}
		onmouseleave={() => (isUpdateButtonHovered = false)}
		disabled={isContentLoading}>{getContentTitle()}</button
	>
	<div class="feed-content">
		<div class="loading-text" hidden={!isContentLoading}>Loading</div>
		<div hidden={isContentLoading}>
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
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
		gap: 20px;
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

	.button_component:disabled {
		color: #a9a9a9;
	}

	.loading-text {
		font-family: 'Nunito Sans', sans-serif;
		color: #fff;
		font-size: 60px;
		position: relative;
		color: transparent;
		-webkit-text-stroke: 2px #fff;
	}

	.loading-text::after {
		content: 'Loading';
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		animation: animate 4s ease-in-out infinite;
		z-index: 2;
	}

	@keyframes animate {
		0%,
		100% {
			clip-path: polygon(
				0% 45%,
				16% 44%,
				33% 50%,
				54% 60%,
				70% 61%,
				84% 59%,
				100% 52%,
				100% 100%,
				0% 100%
			);
		}

		50% {
			clip-path: polygon(
				0% 60%,
				15% 65%,
				34% 66%,
				51% 62%,
				67% 50%,
				84% 45%,
				100% 46%,
				100% 100%,
				0% 100%
			);
		}
	}

	.button-search {
		height: 70px;
		width: 70px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 70px 70px;
		border: none;
		background-color: transparent;
		outline: none;
		background-image: url('$lib/assets/search.svg');
		filter: invert(1);
	}

	.button-search:hover {
		filter: invert(0);
	}
</style>
