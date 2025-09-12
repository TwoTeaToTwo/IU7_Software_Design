<script lang="ts">
	import { type SubscribeViewModel } from '$lib/viewmodels/SubscribeViewModel';
	let { subscription, clickHandler }: { subscription: SubscribeViewModel; clickHandler: any } =
		$props();
	const getRandomColor = (): string => {
		const red = Math.min(Math.floor(Math.random() * 256), 155);
		const green = Math.min(Math.floor(Math.random() * 256), 155);
		const blue = Math.min(Math.floor(Math.random() * 256), 155);
		return `rgb(${red},${green},${blue})`;
	};
	const color = $state(getRandomColor());
	let titleContainer: HTMLDivElement | null = null;
	let titleElement: HTMLDivElement | null = null;
	let isOverflowing = $state(false);
	const titleContainerWidth = $state(220);
	$effect(() => {
		if (titleContainer && titleElement) {
			isOverflowing = titleElement.getBoundingClientRect().width > titleContainerWidth;
		}
	});
</script>

<div class="container">
	<div class="thumbnail" style="--color: {color}"></div>
	<div class="text-block">
		<div class:marquee-container={isOverflowing} bind:this={titleContainer}>
			<div
				class="title text-color-theme"
				class:scrolling-text={isOverflowing}
				bind:this={titleElement}
			>
				{subscription.title}
			</div>
			<div class="information-text text-color-theme" class:scrolling-text={isOverflowing}>
				{subscription.platform}
			</div>
		</div>
	</div>
	<button class="unsubscribe-button" aria-label="unsubscribe" onclick={clickHandler}></button>
</div>

<style>
	.container {
		width: 450px;
		height: 70px;
		display: flex;
		align-items: flex-start;
		gap: 15px;
	}

	.thumbnail {
		width: 70px;
		height: 70px;
		border-radius: 20px;
		background-color: var(--color);
		flex-shrink: 0;
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
		width: 220px;
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

	.unsubscribe-button {
		width: 70px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 70px 70px;
		border: none;
		background-color: transparent;
		outline: none;
		background-image: url('$lib/assets/trash.svg');
		margin-left: auto;
		margin-right: 0;
		z-index: 4;
	}
</style>
