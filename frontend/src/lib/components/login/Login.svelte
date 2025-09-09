<script lang="ts">
	import Input from "$lib/components/login/Input.svelte";
    import TextButton from "$lib/components/login/TextButton.svelte";
    import {LoginViewModel} from "$lib/viewmodels/LoginViewModel";

	let login = $state("");
	let password = $state("");
</script>

<div class="container">
    <Input placeholder="Login" bind:value={login}/>
	<Input placeholder="Password" bind:value={password} type="password"/>
    <TextButton text="Login" handleClick={LoginViewModel.login(login, password)}/>
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