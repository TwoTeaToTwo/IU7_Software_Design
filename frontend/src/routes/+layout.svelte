<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { isLogged } from '$lib/stores/Authentication';
	import { browser } from '$app/environment';
	import '../app.css';

	let { children } = $props();
	isLogged.subscribe((isLogged) => {
		if (browser) {
			document.body.classList[isLogged ? 'add' : 'remove']('bottom');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
