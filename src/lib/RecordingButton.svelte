<div class="container">
	<div class="outer_button button_rounded"/>
	<div class="button button_rounded" />
</div>

<style>
		.container  {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
        height: 28px;
        width: 30px;
		}
    .outer_button {
        border: 1px solid black;
        border-radius: 10%;
        height: 100%;
        width: 100%;
    }
    .button {
        border-radius: 10%;
        background-color: red;
        height: 20px;
        width: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* Centering the button */
    }
		.button_rounded {
        border-radius: 50%;
		}
</style>
