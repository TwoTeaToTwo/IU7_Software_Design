<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Search from '$lib/components/feed/Search.svelte';
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { authController, isLogged } from '$lib/stores/Authentication';
	import { playingPodcast } from '$lib/stores/Store';
	import Player from '$lib/components/Player.svelte';
	import SubscriptionsPanel from '$lib/components/feed/SubscriptionsPanel.svelte';
	import Bubbles from '$lib/components/Bubbles.svelte';
	import PopUp from '$lib/components/PopUp.svelte';
	import { searchPodcast } from '$lib/viewmodels/SearchViewModel';
	import { logout } from '$lib/viewmodels/LoginViewModel';
	import { goto } from '$app/navigation';
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
	let isSearching = $state(false);
	let searchQuery = $state('');
	const maxResults = 5;
	// Functions
	const searchHandler = (): void => {
		const params = new URLSearchParams({
			query: searchQuery
		});
		goto(`/contents?${params.toString()}`);
	};
	const logoutCallback = (): void => {
		authController.getAccessToken().then((accessToken) => {
			logout(accessToken!, errorHandler).then(() => {
				isLogged.set(false);
			});
		});
	};
	const homeCallback = (): void => {
		goto('/feed');
	};

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle} />
<Bubbles />
<SubscriptionsPanel />
<button class="button-home" aria-label="home" onclick={() => homeCallback()}></button>
<button class="button-logout" aria-label="logout" onclick={() => logoutCallback()}></button>
<div class="container">
	<div class="search">
		<Search bind:value={searchQuery} />
		<button class="button-search" aria-label="search" onclick={() => searchHandler()}></button>
	</div>
	{@render children?.()}
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

	.player {
		margin-top: auto;
		margin-bottom: 20px;
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
		animation: tilt-shaking 1s infinite;
	}

	.button-logout {
		height: 70px;
		width: 70px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 70px 70px;
		border: none;
		background-color: transparent;
		outline: none;
		background-image: url('$lib/assets/logout.svg');
		position: absolute;
		top: 10px;
		right: 40px;
		filter: invert(1);
	}

	.button-home {
		height: 70px;
		width: 70px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 70px 70px;
		border: none;
		background-color: transparent;
		outline: none;
		background-image: url('$lib/assets/home.svg');
		position: absolute;
		top: 10px;
		left: 33px;
	}

	.button-logout:hover {
		height: 80px;
		width: 80px;
		background-size: 80px 80px;
		animation: tilt-shaking 0.25s infinite;
	}

	@keyframes tilt-shaking {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(5deg);
		}
		50% {
			transform: rotate(0deg);
		}
		75% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
</style>
