<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import Button from '../Button.svelte';
	import { login as loginCallback } from '$lib/viewmodels/LoginViewModel';
	import PopUp from '../PopUp.svelte';

	let login = $state('');
	let password = $state('');

	let showMessage = $state(false);
	let popUpMessage = $state('');
	let messageTitle = $state('');
	const messageHandler = (msg: string, msgTitle: string) => {
		messageTitle = msgTitle;
		popUpMessage = msg;
		showMessage = true;
		setTimeout(() => {
			showMessage = false;
		}, 3000);
	};
</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle} />
<div class="container">
	<div class="main-container">
		<Input placeholder="Login" bind:value={login} />
		<Input placeholder="Password" bind:value={password} type="password" />
		<Button
			text="Login"
			buttonStyle="width: 500px;"
			textStyle="font-size: 22pt;"
			handler={() => {
				loginCallback(login, password, messageHandler);
			}}
		/>
	</div>
	<div class="waves-container">
		<svg
			class="waves"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 24 150 28"
			preserveAspectRatio="none"
			shape-rendering="auto"
		>
			<defs>
				<path
					id="gentle-wave"
					d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
				/>
			</defs>
			<g class="parallax">
				<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(0,204,254,0.7" />
				<use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(0,204,254,0.5)" />
				<use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(0,204,254,0.3)" />
				<use xlink:href="#gentle-wave" x="48" y="7" fill="#00ccfe" />
			</g>
		</svg>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		flex-direction: column;
	}

	.main-container {
		gap: 40px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.waves-container {
		width: 100%;
		margin-top: auto;
		flex-shrink: 0;
	}

	.waves {
		position: relative;
		width: 100%;
		height: 15vh;
		margin-bottom: -7px;
		min-height: 100px;
		max-height: 150px;
	}

	/* Animation Waves */
	.parallax > use {
		animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
	}
	.parallax > use:nth-child(1) {
		animation-delay: -2s;
		animation-duration: 7s;
	}
	.parallax > use:nth-child(2) {
		animation-delay: -3s;
		animation-duration: 10s;
	}
	.parallax > use:nth-child(3) {
		animation-delay: -4s;
		animation-duration: 13s;
	}
	.parallax > use:nth-child(4) {
		animation-delay: -5s;
		animation-duration: 20s;
	}
	@keyframes move-forever {
		0% {
			transform: translate3d(-90px, 0, 0);
		}
		100% {
			transform: translate3d(85px, 0, 0);
		}
	}
</style>
