<script lang="ts">
	let { text, handleClick } = $props();
</script>

<button class="button_component" onclick={handleClick}>{text}</button>

<style>
	.button_component {
		color: #000000;
		font-family: 'Nunito Sans', sans-serif;
		font-size: 28pt;
		font-weight: bold;
		background: none;
		border: none;
		transition: all 0.2s ease;
	}

	.button_component:hover {
		font-size: 32pt;
	}

	.button_component:active {
		color: #00ccfe;
	}
</style>
