<script lang="ts">
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { playingPodcast } from '$lib/stores/Store';
	import { getPodcastStream } from '$lib/viewmodels/PlayerViewModel';
	import { authController } from '$lib/stores/Authentication';
	import RangeSlider from 'svelte-range-slider-pips';
	import { sl } from 'zod/locales';
	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);
	let sliderTime = $state(0);
	let audioSrc: string | undefined = $state(undefined);
	const format = (timeInSeconds: number): string => {
		if (isNaN(timeInSeconds)) return '...';
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};
	playingPodcast.subscribe((value) => {
		if (!value) {
			audioSrc = undefined;
		} else {
			const podcast = value as PodcastViewModel;
			authController.getAccessToken().then((token) => {
				getPodcastStream(token!, podcast.url).then((src) => {
					audioSrc = src;
				});
			});
		}
	});
	$effect(() => {
		changeTime();
	});
	const changeTime = () => {
		sliderTime = time;
	};
</script>

<div class="rectangle">
	<div class="podcast">
		<div class="thumbnail"></div>
		<div class="text-block">
			<div class="marquee-container">
				<div class="title text-color-theme scrolling-text">{$playingPodcast?.title}</div>
			</div>
			<div class="marquee-container">
				<div class="information-text text-color-theme scrolling-text"></div>
			</div>
		</div>
	</div>
	<div class={['player', { paused }]}>
		{#if audioSrc !== undefined}
			<audio
				src={audioSrc}
				bind:currentTime={time}
				bind:duration
				bind:paused
				onended={() => {
					time = 0;
				}}
			></audio>
			<button class="play" aria-label={paused ? 'play' : 'pause'} onclick={() => (paused = !paused)}
			></button>
			<div class="time">
				<div class="information-text text-color-theme">{format(time)}</div>
				<div class="slider-container">
					<RangeSlider
						bind:value={sliderTime}
						min={0}
						max={duration}
						on:change={(e) => {
							const { value } = e.detail;
							time = value;
						}}
						style="--range-slider: #000000;
							--range-range-limit: #000000;
							--range-range-inactive: #0103b0;
							--range-range: #0103b0;
						    --range-range-hover: #0103b0;
							--range-handle-focus: #0103b0;
							--range-handle-inactive: #0103b0;
							"
					></RangeSlider>
				</div>
				<div class="information-text text-color-theme">{duration ? format(duration) : '--:--'}</div>
			</div>
		{:else}
			<p>NOT LOADED</p>
		{/if}
	</div>
</div>

<style>
	.rectangle {
		width: 1300px;
		height: 100px;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		border: none;
		background-color: #d9d9d9;
	}

	.podcast {
		display: flex;
		align-items: flex-start;
		gap: 15px;
	}

	.thumbnail {
		width: 70px;
		height: 70px;
		border-radius: 20px;
		background-color: #090909;
		flex-shrink: 0;
		margin-top: 15px;
		margin-bottom: auto;
	}

	.text-block {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.title {
		font-weight: bold;
		font-size: 18px;
	}

	.information-text {
		font-size: 18px;
	}

	.text-color-theme {
		color: #000000;
	}

	.marquee-container {
		width: 200px;
		overflow: hidden;
		position: relative;
	}

	.scrolling-text {
		white-space: nowrap;
		position: relative;
		animation: scroll-text 10s linear infinite;
	}

	@keyframes scroll-text {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: var(--fg-3);
		user-select: none;
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0, 0, 0, 0.1));
	}

	button {
		width: 45px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 45px 45px;
		border: none;
		background-color: transparent;
		outline: none;
	}

	[aria-label='pause'] {
		background-image: url('$lib/assets/player/pause.svg');
	}

	[aria-label='play'] {
		background-image: url('$lib/assets/player/play.svg');
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.slider-container {
		width: 650px;
	}
</style>
