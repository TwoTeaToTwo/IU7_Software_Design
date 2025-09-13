<script lang="ts">
	let { isOpen, message, title}: {isOpen: boolean, message: string, title: string} = $props();
</script>

<div class="rectangle" class:open={isOpen}>
    <div class="title text-color-theme">{title}</div>
    <div class="information-text text-color-theme">{message}</div>
</div>

<style>
	.rectangle {
		width: 300px;
		height: 150px;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		border: none;
		background-color: #d9d9d9;
		margin-left: auto;
		margin-right: 20px;
		margin-top: 90px;
		margin-bottom: auto;
		right: -100%;
		transition: right 0.3s ease-in-out;
		z-index: 5;
		position: absolute;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;
	}

	.rectangle.open {
		right: 0;
	}

    .title {
		font-weight: bold;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
	}

    .information-text {
		font-size: 20px;
        font-family: 'Inter', sans-serif;
	}

	.text-color-theme {
		color: #000000;
	}
</style>
