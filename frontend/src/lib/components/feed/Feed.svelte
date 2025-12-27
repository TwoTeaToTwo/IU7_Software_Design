<script lang="ts">
	import { getFeedContent } from '$lib/viewmodels/feed/FeedViewModel';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController } from '$lib/stores/Authentication';
	import Podcast from '../Podcast.svelte';
	import { playingPodcast } from '../../stores/Store';
	import PopUp from '../PopUp.svelte';
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
<button
	class="button_component"
	onclick={() => updateFeed()}
	onmouseenter={() => (isUpdateButtonHovered = true)}
	onmouseleave={() => (isUpdateButtonHovered = false)}
	disabled={isContentLoading}>{getContentTitle()}</button
>
<div class="feed-content">
	<div class="loading-text" hidden={!isContentLoading}>Loading</div>
	<div class="container" hidden={isContentLoading}>
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
		text-decoration: underline;
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
</style>
