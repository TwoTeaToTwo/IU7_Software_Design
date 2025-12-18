<script lang="ts">
	import type { PageProps } from './$types';
	import SearchContent from '$lib/components/SearchContent.svelte';

	let { data }: PageProps = $props();
</script>

<SearchContent bind:query={data.query!} />
