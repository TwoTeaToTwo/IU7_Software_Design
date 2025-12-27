<script lang="ts">
	let { title, channel, platform, relevance, duration, isSelected, clickHandler } = $props();
	let titleContainer: HTMLDivElement | null = null;
	let titleElement: HTMLDivElement | null = null;
	let isOverflowing = $state(false);
	const titleContainerWidth = $state(500);
	$effect(() => {
		if (titleContainer && titleElement) {
			isOverflowing = titleElement.getBoundingClientRect().width > titleContainerWidth;
		}
	});
</script>

<button class="button" class:selected={isSelected} onclick={clickHandler}>
	<div class="content">
		<div class="thumbnail"></div>
		<div class="text-block">
			<div class:marquee-container={isOverflowing} bind:this={titleContainer}>
				<div
					class="title text-color-theme"
					class:scrolling-text={isOverflowing}
					class:selected={isSelected}
					bind:this={titleElement}
				>
					{title}
				</div>
			</div>
			<div class="marquee-container">
				<div class="information-text text-color-theme scrolling-text" class:selected={isSelected}>
					{channel}
				</div>
			</div>
		</div>
	</div>
	<div class="information">
		<div class="information-text text-color-theme" class:selected={isSelected}>{platform}</div>
		<div class="information-text text-color-theme" class:selected={isSelected}>{relevance}</div>
		<div class="information-text text-color-theme" class:selected={isSelected}>{duration}</div>
	</div>
</button>

<style>
	.button {
		width: 1200px;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		border: none;
		background-color: var(--button-blue);
	}

	.button.selected {
		background-color: #d9d9d9ff;
	}

	.content {
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

	.information {
		display: flex;
		margin-top: 20px;
		margin-right: 30px;
		gap: 8px;
		margin-left: auto;
	}

	.information-text {
		font-size: 20px;
	}

	.text-color-theme {
		color: #d9d9d9;
	}

	.text-color-theme.selected {
		color: #000000;
	}

	.marquee-container {
		width: 500px;
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
</style>
