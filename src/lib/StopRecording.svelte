<script>
	export let elapsedTime;
	export let onClick;
</script>

<div class="container">
	<button class="stop" on:click={onClick} />
	<div class="time_container">
		<p>{elapsedTime} / 2:00</p>
	</div>
</div>

<style>
	.container {
			display: flex;
			align-items: center;
			padding: 10px;
			border-radius: 6px;
			background-color: white;
			gap: 10px;

	}
	.stop {
			background-color: red;
			height: 22px;
			width: 22px;
			border-radius: 4px;
			border: none;
			cursor: pointer;
	}
	.time_container {
			color: var(--primary);
			font-weight: bold;
			font-size: 20px;
	}
</style>

