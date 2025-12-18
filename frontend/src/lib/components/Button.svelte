<script lang="ts">
	interface ButtonProps {
		text: string;
		disabled?: boolean;
		handler: () => void;
		buttonStyle?: string;
		textStyle?: string;
	}
	let { text, disabled = false, handler, buttonStyle = '', textStyle = '' }: ButtonProps = $props();
</script>

<button class="custom-button" class:disabled style={buttonStyle} onclick={handler}>
	<span class="button-text" style={textStyle}>{text}</span>
</button>

<style>
	.custom-button {
		padding: 12px 14px 12px 14px;
		gap: 10px;
		background-color: var(--button-blue);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.custom-button.disabled {
		opacity: 0.8;
		pointer-events: none;
	}

	.custom-button:hover {
		opacity: 0.85;
	}

	.button-text {
		color: var(--pure-white);
		font-weight: 500;
		font-size: 14pt;
		text-align: center;
	}
</style>
