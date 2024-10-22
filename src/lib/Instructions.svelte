<script>
	export let onContinue;
</script>

<div class="container">
	<p class="title">Instructions</p>
	<div class="steppers">
		<div class="step_container">
			<p class="subtitle"><span class="subtitle_bold">Step 1: Read the Question</span></p>
			<p class="subtext">Read the question at the top and take a moment to plan your answer. Think through your response as if you're in a real interview.</p>
		</div>
		<div class="step_container">
			<p class="subtitle"><span class="subtitle_bold">Step 2: Record your Interview</span></p>
			<p class="subtext">After clicking Continue below, you will be presented with a record button. You can re-record as many times as you need until you're satisfied with your answer.</p>
		</div>
		<div class="step_container">
			<p class="subtitle"><span class="subtitle_bold">Step 3: Submit for Feedback</span></p>
			<p class="subtext">Once you're happy, submit your recording. You’ll get feedback within 24 hours to help you improve.</p>
		</div>
	</div>
	<button class="button" on:click={onContinue}>Continue</button>
</div>

<style>
    .button {
        color: var(--secondary_2);
        border: none;
        background-color: white;
        font-weight: bold;
        padding: 8px 22px;
        border-radius: 10px;
        font-size: 24px;
        cursor: pointer;
        margin-top: 35px;
				margin-bottom: 10px;
    }
	.step_container:not(:first-child) {
			margin-top: 40px;
	}
	.subtext {
			margin-top: 10px;
			font-size: 20px;
			font-weight: 300;
	}
	.steppers {
			margin-top: 30px;
			max-width: 500px;
	}
	.subtitle {
			font-size: 26px;
	}
	.subtitle_bold {
			font-weight: bold;
	}
	.title {
			font-size: 36px;
			font-weight: bold;
	}
	.container {
			color: white;
			padding: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: var(--secondary_2);
			border-radius: 12px;
	}
</style>