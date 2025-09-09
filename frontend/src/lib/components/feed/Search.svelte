<script lang="ts">
    let {
        value = $bindable(),
        type = "text",
        placeholder = "",
        disabled = false,
    } = $props();
</script>

<input class="input_component" {type} {placeholder} {disabled} bind:value>

<style>
    .input_component
	{
		color: #000000;
		font-family: 'Inter', sans-serif;
    	font-size: 28pt;
    	font-weight: bold;
		border-radius: 20px;
		border: 2px solid #FFFFFF;
		background-color: #D9D9D9;
		padding-top: 12px;
		padding-bottom: 12px;
		padding-left: 20px;
	}
</style>