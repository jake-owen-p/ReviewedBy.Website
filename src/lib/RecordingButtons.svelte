<script>
	import RecordingButton from '$lib/RecordingButton.svelte';

	export let onPress;
</script>

<div class="container">
	<p class="text">{ 'Start' } Recording</p>

	<button class="button" on:click={onPress}>
		<RecordingButton />
	</button>
</div>

<style>
	.container {
			display: flex;
			align-items: center;
			flex-direction: column;
      padding: 10px 30px;
	}
	.text {
			font-size: 20px;
			font-weight: bold;
	}
	.button {
			margin-top: 10px;
			border: none;
			background-color: white;
			cursor: pointer;
	}
</style>
