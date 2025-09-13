<script lang="ts">
	import { authController } from '$lib/stores/Authentication';
	import { subscribe, type SubscribeViewModel } from '$lib/viewmodels/SubscribeViewModel';
	import Input from '../Input.svelte';
	import TextButton from '../TextButton.svelte';
	import PopUp from '../PopUp.svelte';
	let { isOpen=$bindable(), subscriptions=$bindable() }: {isOpen: boolean, subscriptions: Array<SubscribeViewModel>} = $props();
	let title = $state("");
	let url = $state("");
	
	let showMessage = $state(false);
	let popUpMessage = $state("");
	let messageTitle = $state("");
	const errorHandler = (msg: string) => {
		messageTitle = "ERROR";
		popUpMessage = msg;
		showMessage = true;
		setTimeout(() => {showMessage = false;}, 3000);
	}

	const subscribeHandler = () => {
		authController.getAccessToken().then((accessToken) => {
			subscribe(accessToken!, title, url, errorHandler).then((subscribe) => {
				if (subscribe)
				{
					isOpen = false;
					title = "";
					url = "";
					subscriptions = [...subscriptions, subscribe];
				}
			});
		});
	}
</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle}/>
<div class="filter" class:open={isOpen}></div>
<div class="rectangle" class:open={isOpen}>
	<button
					class="close"
					aria-label="close"
					onclick={() => isOpen = !isOpen}
				></button>
	<Input placeholder="TITLE" bind:value={title} fontSize={"20pt"} width={"500px"}/>
	<Input placeholder="URL" bind:value={url} fontSize={"20pt"} width={"500px"}/>
	<TextButton
		text="Subscribe"
		handleClick={() => {
			subscribeHandler();
		}}
	/>
</div>

<style>
	.rectangle {
		width: 900px;
		height: 800px;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		border: none;
		background-color: #d9d9d9;
		margin-left: 510px;
		margin-right: auto;
		margin-top: 90px;
		margin-bottom: auto;
		left: 100%;
		transition: left 0.3s ease-in-out;
		z-index: 5;
		position: absolute;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;
	}

	.rectangle.open {
		left: 0;
	}

	.filter {
		width: 100%;
		height: 100%;
		background-color: #00000000;
		z-index: 4;
		transition: background-color 0.3s ease-in-out;
		position: absolute;
		pointer-events: none;
	}

	.filter.open {
		pointer-events: auto;
		background-color: #000000a0;
	}

	.close {
		width: 70px;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: 70px 70px;
		border: none;
		background-color: transparent;
		outline: none;
		background-image: url('$lib/assets/close.svg');
		position: absolute;
		top: 10px;
		left: 10px;
	}
</style>
