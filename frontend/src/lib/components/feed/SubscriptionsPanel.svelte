<script lang="ts">
	import { onMount } from 'svelte';
	import { authController } from '$lib/stores/Authentication';
	import {
		type SubscribeViewModel,
		getSubscriptions,
		unsubscribe
	} from '$lib/viewmodels/SubscribeViewModel';
	import Subscription from './Subscription.svelte';
	let isOpen = $state(false);
	let subscriptions = $state(new Array<SubscribeViewModel>());
	const getSubscriptionsHandler = () => {
		authController.getAccessToken().then((accessToken) => {
			getSubscriptions(accessToken!).then((_subscriptions) => {
				if (_subscriptions) {
					subscriptions = _subscriptions;
				}
			});
		});
	};
	onMount(() => {
		getSubscriptionsHandler();
	});
	const unsubscribeHandler = (subscribeId: number) => {
		authController.getAccessToken().then((accessToken) => {
			unsubscribe(accessToken!, subscribeId).then(() => {
				subscriptions = subscriptions.filter((sub) => sub.id !== subscribeId);
			});
		});
	};
</script>

<div class="filter" class:open={isOpen}></div>
<div class="rectangle" class:open={isOpen}>
	<button
		class="tab-button"
		aria-label="tab-button"
		onclick={() => {
			isOpen = !isOpen;
		}}
	>
		<div class="img-background">
			<enhanced:img
				class="inv-img"
				width="70px"
				height="70px"
				src="$lib/assets/content.svg"
				alt="tab"
			/>
		</div>
		<div class="information-text text-color-theme tab-text">Close</div>
	</button>
	{#each subscriptions as subscription}
		<Subscription
			{subscription}
			clickHandler={() => {
				unsubscribeHandler(subscription.id);
			}}
		/>
	{/each}
</div>

<style>
	.rectangle {
		width: 70px;
		height: 800px;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		border: none;
		background-color: #d9d9d9;
		margin-left: 20px;
		margin-right: auto;
		margin-top: 90px;
		margin-bottom: auto;
		transition: width 0.3s ease-in-out;
		z-index: 3;
		position: absolute;
		display: flex;
		justify-content: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		flex-direction: column;
		gap: 10px;
	}

	.rectangle.open {
		width: 450px;
	}

	.filter {
		width: 100%;
		height: 100%;
		background-color: #00000000;
		z-index: -2;
		transition: background-color 0.3s ease-in-out;
		position: absolute;
	}

	.filter.open {
		z-index: 2;
		background-color: #000000a0;
	}

	.tab-button {
		width: 400px;
		height: 70px;
		display: flex;
		align-items: flex-start;
		display: flex;
		border: none;
		background-color: #00000000;
		border-radius: 20px;
		padding: 0;
	}

	.inv-img {
		filter: invert(1);
	}

	.img-background {
		position: relative;
		color: #000000;
		width: 70px;
		height: 70px;
		border-radius: 20px;
		display: flex;
	}

	.img-background::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000000;
		border-radius: 20px;
		z-index: -1;
	}

	.information-text {
		font-weight: bold;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
	}

	.text-color-theme {
		color: #000000;
	}

	.tab-text {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70px;
		flex: 1;
	}
</style>
