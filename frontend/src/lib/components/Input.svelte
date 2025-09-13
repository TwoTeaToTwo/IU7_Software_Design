<script lang="ts">
	let {
		value = $bindable(),
		type = 'text',
		placeholder = '',
		disabled = false,
		fontSize = '28pt',
		width = 'auto'
	} = $props();
</script>

<input
	class="input_component"
	style="--font-size: {fontSize}; --width: {width};"
	{placeholder}
	{disabled}
	bind:value
/>

<style>
	.input_component {
		color: #000000;
		font-family: 'Inter', sans-serif;
		font-size: var(--font-size);
		font-weight: bold;
		border-radius: 20px;
		border: 2px solid #ffffff;
		background-color: #ffffff;
		padding-top: 12px;
		padding-bottom: 12px;
		padding-left: 20px;
		width: var(--width);
	}
</style>
