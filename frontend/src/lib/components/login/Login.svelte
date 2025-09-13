<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import { LoginViewModel } from '$lib/viewmodels/LoginViewModel';
	import PopUp from '../PopUp.svelte';

	let login = $state('');
	let password = $state('');

	let showMessage = $state(false);
	let popUpMessage = $state("");
	let messageTitle = $state("");
	const messageHandler = (msg: string, msgTitle: string) => {
		messageTitle = msgTitle;
		popUpMessage = msg;
		showMessage = true;
		setTimeout(() => {showMessage = false;}, 3000);
	}

</script>

<PopUp isOpen={showMessage} message={popUpMessage} title={messageTitle}/>
<div class="container">
	<Input placeholder="Login" bind:value={login} />
	<Input placeholder="Password" bind:value={password} type="password" />
	<TextButton
		text="Login"
		handleClick={() => {
			LoginViewModel.login(login, password, messageHandler);
		}}
	/>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		flex-direction: column;
		gap: 40px;
	}
</style>
