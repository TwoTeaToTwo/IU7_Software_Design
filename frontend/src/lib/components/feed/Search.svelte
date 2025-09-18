<script lang="ts">
	let {
		value = $bindable(),
		type = 'text',
		placeholder = 'Search',
		disabled = false
	}: { value?: string; type?: string; placeholder?: string; disabled?: boolean } = $props();
</script>

<input class="input_component" {type} {placeholder} {disabled} bind:value />

<style>
	.input_component {
		color: #000000;
		font-family: 'Inter', sans-serif;
		font-size: 20px;
		font-weight: bold;
		border-radius: 20px;
		border: 2px solid #ffffff;
		background-color: #d9d9d9;
		padding-top: 12px;
		padding-bottom: 12px;
		padding-left: 20px;
		width: 950px;
		height: 26px;
	}
</style>
