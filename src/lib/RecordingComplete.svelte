<script>
	export let startRecording;
	export let playRecording;
	export let onSave;
	export let savingVideoState;
	import { page } from '$app/stores';

	let checked = false;
	let email = $page.url.searchParams.get('email');
</script>

<div class="container">
	<div class="text_container">
		<p class="text">Recording Complete</p>
		{#if savingVideoState === 'saved'}
			<p class="subtext">Thank you for completing the interview, one of our professionals will provide feedback via email within 24 hours </p>
		{:else}
			<p class="subtext">Please submit your interview to be reviewed, or you can start again if you want to give it another go!</p>
			<div>
				<div style="padding: 0 20px">
					<h6 class="heading">Email</h6>
					<input class="email_input" bind:value={email} />
				</div>
				<div style="display: flex; padding: 0 20px; align-items: flex-start; margin-top: 15px">
					<input type="checkbox" bind:checked={checked} />
					<p style="text-align: left; margin-left: 10px">I agree to the <span class="link">
						<a target="_blank" href="https://sites.google.com/view/reviewedby-terms/home">Terms of Use</a></span> and <span class="link"><a target="_blank" href="https://sites.google.com/view/reviewedby-privacy/home">Privacy Policy</a></span>.</p>
				</div>
				<p></p>
				{#if savingVideoState === 'saving'}
					<img style="margin-top: 10px; width: 30px; height: 30px" alt="spinner" src="/grads/spinner.svg" />
				{:else}
					<button class="button" on:click={() => onSave(email)} class:disabled={!checked || !email || email?.length < 1}>Submit for Review</button>
				{/if}
			</div>
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
		.heading {
				margin: 0;
        text-align: left;
				font-size: 16px;
		}
    .email_input {
				margin-top: 10px;
        width: 100%;
        height: 30px;
        border-radius: 8px;
        padding: 0 10px;
        font-size: 14px;
        border: 1px solid rgba(47, 72, 88, 0.3);
    }
    .email_input:focus {
        outline: none;
    }
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
				background-color: var(--primary);
		}
		.v_seperator {
				width: 1px;
        background-color: var(--primary);
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
        background-color: #eff6ff;
				border-radius: 10px;
				padding: 10px;
        margin: 10px 20px;
    }
		.disabled {
        background-color: #717171 !important;
		}
    .button {
        background-color: var(--primary);
				border: none;
				color: white;
				font-weight: bold;
				padding: 8px 22px;
				border-radius: 10px;
				font-size: 16px;
				cursor: pointer;
				margin-top: 10px;
    }
</style>
