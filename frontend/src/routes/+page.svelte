<script>
	import Login from '$lib/components/login/Login.svelte';
	import Feed from '$lib/components/feed/Feed.svelte';
	import { authController, isLogged } from '$lib/stores/Authentication';
</script>

{#await authController.responseAccessToken()}
	<div class="text text-in">Loading</div>
	<div class="text text-out">Loading</div>
{:then}
	{#if $isLogged === false}
		<Login />
	{:else}
		<Feed />
	{/if}
{/await}

<style>
	.text {
		font-family: 'Nunito Sans', sans-serif;
		color: #fff;
		font-size: 8em;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.text-in {
		color: transparent;
		-webkit-text-stroke: 2px #00ccfe;
	}

	.text-out {
		color: #00ccfe;
		animation: animate 4s ease-in-out infinite;
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
