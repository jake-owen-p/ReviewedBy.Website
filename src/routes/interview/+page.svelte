<script lang="ts">
	import { onMount } from 'svelte';

	let mediaRecorder: MediaRecorder;
	let recordedChunks: Blob[] = [];
	let stream: MediaStream = null;
	let videoUrl: string;
	let recording: boolean = false;

	let videoElement: HTMLVideoElement; // Reference to the video element

	let devices: MediaDeviceInfo[] = [];
	let audioDevices: MediaDeviceInfo[] = [];
	let videoDevices: MediaDeviceInfo[] = [];
	let selectedAudioDeviceId: string;
	let selectedVideoDeviceId: string;
	let audioDeviceLabel: string = '';
	let videoDeviceLabel: string = '';

	// Get user media and devices on component mount
	onMount(async () => {
		try {
			// Request permissions
			await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

			// Get the list of devices
			devices = await navigator.mediaDevices.enumerateDevices();
			audioDevices = devices.filter((device) => device.kind === 'audioinput');
			videoDevices = devices.filter((device) => device.kind === 'videoinput');

			// Set default devices
			if (audioDevices.length > 0) {
				selectedAudioDeviceId = audioDevices[0].deviceId;
				audioDeviceLabel = audioDevices[0].label;
			}

			if (videoDevices.length > 0) {
				selectedVideoDeviceId = videoDevices[0].deviceId;
				videoDeviceLabel = videoDevices[0].label;
			}

			// Start the live preview
			await startPreview();
		} catch (err) {
			console.error('Error accessing media devices.', err);
		}
	});

	async function startPreview() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined },
				audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined },
			});

			videoElement.srcObject = stream;
			videoElement.muted = true; // Mute during live preview
			videoElement.play();
		} catch (err) {
			console.error('Error accessing media devices.', err);
		}
	}

	function handleAudioDeviceChange(event) {
		selectedAudioDeviceId = event.target.value;
		audioDeviceLabel = audioDevices.find((d) => d.deviceId === selectedAudioDeviceId)?.label || '';
		startPreview();
	}

	function handleVideoDeviceChange(event) {
		selectedVideoDeviceId = event.target.value;
		videoDeviceLabel = videoDevices.find((d) => d.deviceId === selectedVideoDeviceId)?.label || '';
		startPreview();
	}

	async function startRecording() {
		recordedChunks = []; // Clear recorded chunks before starting new recording

		if (!stream) {
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined },
					audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined },
				});
			} catch (err) {
				console.error('Error accessing media devices.', err);
				return;
			}
		}

		videoElement.srcObject = stream;
		videoElement.src = null;
		videoElement.muted = true; // Mute during recording
		videoElement.play();

		// Initialize MediaRecorder with correct MIME type
		let options = { mimeType: 'video/webm; codecs=vp8,opus' };

		if (!MediaRecorder.isTypeSupported(options.mimeType)) {
			options = { mimeType: 'video/webm' };
		}

		try {
			mediaRecorder = new MediaRecorder(stream, options);
		} catch (e) {
			console.error('Exception while creating MediaRecorder:', e);
			return;
		}

		mediaRecorder.ondataavailable = handleDataAvailable;
		mediaRecorder.onstop = handleStop;
		mediaRecorder.start(); // Start recording
		recording = true;
	}

	function handleDataAvailable(event: any) {
		if (event.data && event.data.size > 0) {
			recordedChunks.push(event.data);
		}
	}

	function handleStop() {
		const blob = new Blob(recordedChunks, { type: 'video/webm' });
		videoUrl = URL.createObjectURL(blob);
	}

	function stopRecording() {
		mediaRecorder.stop();
		console.log('Audio Tracks:', stream.getAudioTracks());
		recording = false;
	}

	function playRecording() {
		// Stop the webcam stream
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		videoElement.srcObject = null;
		videoElement.src = videoUrl;
		videoElement.muted = false; // Unmute during playback
		videoElement.play();

	}

	async function requestPermissions() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			// Permissions granted, you can now use the stream
			console.log('Microphone and camera permissions granted.');
			// Do something with the stream if needed
			stream.getTracks().forEach((track) => track.stop()); // Stop the tracks if not needed immediately
		} catch (err) {
			console.error('Error requesting media permissions:', err);
			if (err.name === 'NotAllowedError') {
				console.log('Permissions have been denied.');
			} else if (err.name === 'NotFoundError') {
				console.log('No media devices found.');
			}
			// Handle errors as needed
		}
	}
</script>

<main class="container">
	<div class="header">
		<div class="logo_container">
			<img class="logo" src="/logo.svg" alt="img" />
			<p class="text title">ReviewedBy</p>
		</div>
		<h1 class="text hero_title">Submit Your 2 Minute Interview for Feedback</h1>
	</div>
	<div class="inner_container">
		<div class="question">
			<p>What is your favourite feature from any programming language?</p>
			<p>You have 2 minutes</p>
		</div>

		<!-- Device Selection -->
<!--		<div class="device-selection">-->
<!--			<label for="audio-select">Select Audio Device:</label>-->
<!--			<select id="audio-select" on:change={handleAudioDeviceChange}>-->
<!--				{#each audioDevices as device}-->
<!--					<option value={device.deviceId} selected={device.deviceId === selectedAudioDeviceId}>-->
<!--						{device.label || 'Microphone'}-->
<!--					</option>-->
<!--				{/each}-->
<!--			</select>-->

<!--			<label for="video-select">Select Video Device:</label>-->
<!--			<select id="video-select" on:change={handleVideoDeviceChange}>-->
<!--				{#each videoDevices as device}-->
<!--					<option value={device.deviceId} selected={device.deviceId === selectedVideoDeviceId}>-->
<!--						{device.label || 'Camera'}-->
<!--					</option>-->
<!--				{/each}-->
<!--			</select>-->
<!--		</div>-->

<!--		&lt;!&ndash; Display Selected Devices &ndash;&gt;-->
<!--		<div class="device-info">-->
<!--			<p>Audio Device: {audioDeviceLabel}</p>-->
<!--			<p>Video Device: {videoDeviceLabel}</p>-->
<!--		</div>-->

		<!-- Single video element for preview and playback -->
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class="video" bind:this={videoElement} autoplay playsinline controls={!stream}></video>

		<div>
			{#if !recording}
				<button on:click={startRecording}>Start Recording</button>
			{:else}
				<button on:click={stopRecording}>Stop Recording</button>
			{/if}
		</div>

		<button on:click={playRecording}>Play Recording</button>
<!--		<button on:click={requestPermissions}>Request Microphone and Camera Access</button>-->

	</div>
</main>

<style>
		.question p {
        font-weight: bold;
				text-align: center;
		}
    .question {
        padding-bottom: 20px;
    }
		.inner_container {
				height: 65%;
		}
		.video {
				width:90%;
				height: 100%;
				margin-left: 5%;
				border-radius: 20px;
				object-fit: cover;
		}
    .hero_title {
        padding-bottom: 15px;
        font-size: 32px;
    }
    .header {
        background-color: white;
        padding: 20px 20px 0 20px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        text-align: center;
    }
    .container {
				height: 100vh;
		}
    .logo {
        height: 20px;
        width: 20px;
    }
    .logo_container {
        display: flex;
        align-items: center;
    }
    .title {
        margin-left: 5px;
        font-size: 18px;
        font-weight: 800;
    }
    .text {
        color: var(--secondary);
    }
    .device-selection {
        margin-bottom: 15px;
    }
    .device-selection label {
        margin-right: 5px;
    }
    .device-selection select {
        margin-right: 15px;
    }
    .device-info {
        margin-bottom: 15px;
    }
</style>
