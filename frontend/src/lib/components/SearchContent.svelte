<script lang="ts">
	import { searchPodcast } from '$lib/viewmodels/SearchViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from './Podcast.svelte';
	import { playingPodcast } from '../stores/Store';
	import PopUp from './PopUp.svelte';
	import Button from './Button.svelte';

	// Pop up messages
	let { query = $bindable() }: { query: string } = $props();
	let showMessage = $state(false);
	let popUpMessage = $state('');
	let messageTitle = $state('');
	let page = 1;
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
	let isSearching = $state(false);
	const maxResults = 5;
	// Functions
	const searchHandler = (searchQuery: string): void => {
		isSearching = true;
		isContentLoading = true;
		authController.getAccessToken().then((accessToken) => {
			searchPodcast(searchQuery, maxResults, accessToken!, messageHandler, page).then(
				(podcasts) => {
					isContentLoading = false;
					if (podcasts) {
						feedContent = [...feedContent, ...podcasts];
					}
				}
			);
		});
	};

	const updateContent = (): void => {
		page++;
		searchHandler(query);
	};

	$effect(() => {
		searchHandler(query);
	});
</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle} />
<div class="feed-content">
	<div class="loading-text" hidden={!isContentLoading}>Loading</div>
	{#if !isContentLoading}
		<div class="container">
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
			<Button text="Update" buttonStyle="width: 100%;" handler={updateContent} />
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;

		gap: 10px;
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
</style>
