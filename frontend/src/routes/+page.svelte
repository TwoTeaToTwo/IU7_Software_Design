<script>
	import Login from '$lib/components/login/Login.svelte';
	import Feed from '$lib/components/feed/Feed.svelte';
	import { authController, isLogged } from '$lib/stores/Authentication';
</script>

{#await authController.responseAccessToken()}
	<!-- TODO -->
	<span>Loading</span>
{:then}
	{#if $isLogged === false}
		<Login />
	{:else}
		<Feed />
	{/if}
{/await}
