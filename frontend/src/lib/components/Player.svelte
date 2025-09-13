<script lang="ts">
	import type { PodcastViewModel } from '$lib/viewmodels/PodcastViewModel';
	import { playingPodcast } from '$lib/stores/Store';
	import { getPodcastStream } from '$lib/viewmodels/PlayerViewModel';
	import { authController } from '$lib/stores/Authentication';
	import RangeSlider from 'svelte-range-slider-pips';
	let time = $state(0);
	let duration = $state(0);
	let paused = $state(true);
	let sliderTime = $state(0);
	let volume = $state(0.5);
	let audioSrc: string | undefined = $state(undefined);
	let restartPlayerKey = $state({});
	let restartInfoKey = $state({});
	let titleContainer: HTMLDivElement | null = $state(null);
	let titleElement: HTMLDivElement | null = $state(null);
	let isOverflowing = $state(false);
	const titleContainerWidth = $state(200);

	const format = (timeInSeconds: number): string => {
		if (isNaN(timeInSeconds)) return '...';
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};
	const restartPlayer = (): void => {
		restartPlayerKey = {};
	};
	const restartInfo = (): void => {
		restartInfoKey = {};
	};
	const changeTime = () => {
		sliderTime = time;
	};

	playingPodcast.subscribe((value) => {
		if (!value) {
			audioSrc = undefined;
		} else {
			restartInfo();
			audioSrc = undefined;
			const podcast = value as PodcastViewModel;
			authController.getAccessToken().then((token) => {
				getPodcastStream(token!, podcast.url).then((src) => {
					audioSrc = src;
					restartPlayer();
				});
			});
		}
	});

	$effect(() => {
		changeTime();
	});
	$effect(() => {
		if (titleContainer && titleElement) {
			isOverflowing = titleElement.getBoundingClientRect().width > titleContainerWidth;
		}
	});
</script>

<div class="rectangle">
	{#key restartInfoKey}
		<div class="podcast">
			<div class="thumbnail"></div>
			<div class="text-block">
				<div class:marquee-container={isOverflowing} bind:this={titleContainer}>
					<div
						class="title text-color-theme"
						class:scrolling-text={isOverflowing}
						bind:this={titleElement}
					>
						{$playingPodcast?.title}
					</div>
				</div>
				<div class="marquee-container">
					<div class="information-text text-color-theme scrolling-text"></div>
				</div>
			</div>
		</div>
	{/key}
	<div class={['player', { paused }]}>
		{#if audioSrc !== undefined}
			{#key restartPlayerKey}
				<audio
					src={audioSrc}
					bind:currentTime={time}
					bind:duration
					bind:paused
					bind:volume
					onended={() => {
						time = 0;
					}}
				></audio>
				<button
					class="play"
					aria-label={paused ? 'play' : 'pause'}
					onclick={() => (paused = !paused)}
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
							--range-handle-inactive: #000000;
							"
						></RangeSlider>
					</div>
					<div class="information-text text-color-theme">
						{duration ? format(duration) : '--:--'}
					</div>
					<enhanced:img
						width="45px"
						height="45px"
						src="$lib/assets/player/speaker.svg"
						alt="volume"
					/>
					<div class="volume-container">
						<RangeSlider
							bind:value={volume}
							min={0}
							max={1}
							style="--range-slider: #000000;
							--range-range-limit: #000000;
							--range-range-inactive: #0103b0;
							--range-range: #0103b0;
						    --range-range-hover: #0103b0;
							--range-handle-focus: #0103b0;
							--range-handle-inactive: #000000;
							"
							step={0.01}
						></RangeSlider>
					</div>
				</div>
			{/key}
		{:else}
			<div class="loading-container">
				<div class="loading-text">Loading</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.rectangle {
		width: 1400px;
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
		font-size: 20px;
		font-family: 'Inter', sans-serif;
	}

	.information-text {
		font-size: 20px;
		font-family: 'Inter', sans-serif;
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

	.loading-container {
		margin-left: 350px;
		margin-right: auto;
	}

	.volume-container {
		width: 150px;
	}

	.loading-text {
		font-family: 'Nunito Sans', sans-serif;
		color: #fff;
		font-size: 60px;
		position: relative;
		color: transparent;
		-webkit-text-stroke: 2px #000000;
	}

	.loading-text::after {
		content: 'Loading';
		position: absolute;
		top: 0;
		left: 0;
		color: #0103b0;
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
