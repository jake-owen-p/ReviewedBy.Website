<script>
	export let startRecording;
	export let playRecording;
	export let onSave;
	export let savingVideoState;

	$: console.log(savingVideoState)
</script>

<div class="container">
	<div class="text_container">
		<p class="text">Recording Complete</p>
		{#if savingVideoState === 'saved'}
			<p class="subtext">Thank you for completing the interview, one of our experts will provide feedback via email within 24 hours </p>
		{:else}
			<p class="subtext">Please submit your interview to be reviewed, or you can start again if you want to give it another go!</p>
			{#if savingVideoState === 'saving'}
				<img alt="spinner" src="/spinner.svg" />
			{:else}
				<button class="button" on:click={onSave}>Submit for Review</button>
			{/if}
	  {/if}
	</div>
	<div class="buttons">
		<div class="h_seperator" />
		<div class="restart_buttons">
			<div class="button_container" on:click={playRecording}>
				<img src="/play.svg" alt="play" />
				<p>Play</p>
			</div>
			<div class="v_seperator" />
			<div class="button_container" on:click={startRecording}>
				<img src="/restart.svg" alt="restart" />
				<p>Start Again</p>
			</div>
		</div>
	</div>
</div>

<style>
		.text_container {
				text-align: center;
				padding: 10px 20px 15px 20px;
		}
		.container {
        padding: 10px 0 0 0;
		}
		.buttons {
				width: 100%;
				cursor: pointer;
		}
		.button_container {
				width: 100%;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
        height: 50px;
				gap: 5px;
		}
		.h_seperator {
				width: 100%;
				height: 1px;
				background-color: var(--secondary);
		}
		.v_seperator {
				width: 1px;
        background-color: var(--secondary);
		}
		.restart_buttons {
				display: flex;
		}
    .container {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .text {
        font-size: 20px;
        font-weight: bold;
    }
    .subtext {
        font-size: 16px;
				margin-top: 20px;
				margin-bottom: 20px;
    }
    .button {
        background-color: var(--secondary);
				color: white;
				font-weight: bold;
				padding: 7px 20px;
				border-radius: 10px;
				font-size: 16px;
				cursor: pointer;
    }
</style>
