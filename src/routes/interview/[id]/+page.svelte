<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StartRecording from '$lib/RecordingButtons.svelte';
	import RecordingComplete from '$lib/RecordingComplete.svelte';
	import StopRecording from '$lib/StopRecording.svelte';
	import { page } from '$app/stores';

	let mediaRecorder: MediaRecorder;
	let recordedChunks: Blob[] = [];
	let stream: MediaStream | null = null;
	let videoUrl: string = '';
	let recording: boolean = false;
	let savingVideoState = 'not-started';

	let videoElement: HTMLVideoElement; // Reference to the video element

	let devices: MediaDeviceInfo[] = [];
	let audioDevices: MediaDeviceInfo[] = [];
	let videoDevices: MediaDeviceInfo[] = [];
	let selectedAudioDeviceId: string = '';
	let selectedVideoDeviceId: string = '';
	let audioDeviceLabel: string = '';
	let videoDeviceLabel: string = '';
	let isPlaying: boolean = false;

	let options: MediaRecorderOptions = {}; // Initialize options at the top to access in other functions
	let mimeType: string = ''; // Store the actual MIME type used

	// Timer variables
	let timer: number = 0;
	let timerInterval: number | undefined;
	let elapsedFormattedTime: string = "0:00";

	// Function to detect iOS devices
	function isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	}

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

	// Clean up on component destroy
	onDestroy(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		if (timerInterval) {
			clearInterval(timerInterval);
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

	function handleAudioDeviceChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedAudioDeviceId = target.value;
		audioDeviceLabel = audioDevices.find((d) => d.deviceId === selectedAudioDeviceId)?.label || '';
		startPreview();
	}

	function handleVideoDeviceChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedVideoDeviceId = target.value;
		videoDeviceLabel = videoDevices.find((d) => d.deviceId === selectedVideoDeviceId)?.label || '';
		startPreview();
	}

	async function startRecording() {
		savingVideoState = 'not-started'
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

		// Initialize MediaRecorder with correct MIME type
		if (MediaRecorder.isTypeSupported('video/mp4;codecs="avc1.42E01E, mp4a.40.2"')) {
			options = { mimeType: 'video/mp4;codecs="avc1.42E01E, mp4a.40.2"' };
			mimeType = 'video/mp4';
		} else if (MediaRecorder.isTypeSupported('video/mp4')) {
			options = { mimeType: 'video/mp4' };
			mimeType = 'video/mp4';
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
			options = { mimeType: 'video/webm; codecs=vp9' };
			mimeType = 'video/webm; codecs=vp9';
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
			options = { mimeType: 'video/webm; codecs=vp8' };
			mimeType = 'video/webm; codecs=vp8';
		} else {
			options = {}; // Let the browser decide
			mimeType = '';
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

		// Start the independent timer
		startTimer();
	}

	function handleDataAvailable(event: BlobEvent) {
		if (event.data && event.data.size > 0) {
			recordedChunks.push(event.data);
		}
	}

	let blob: any;

	function handleStop() {
		blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
		videoUrl = URL.createObjectURL(blob);
		// Stop the webcam stream
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		// Switch video element to the recorded video
		videoElement.srcObject = null;
		videoElement.src = videoUrl;
		videoElement.currentTime = 0; // Ensure it starts at the beginning
		videoElement.pause();
		videoElement.muted = false; // Unmute during playback

		// Reset the timer
		resetTimer();
	}

	function stopRecording() {
		if (mediaRecorder && recording) {
			mediaRecorder.stop();
			recording = false;
			// Timer will be reset in handleStop
		}
	}

	function playRecording() {
		// Stop the webcam stream if it's still active
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		videoElement.srcObject = null;
		videoElement.src = videoUrl;
		videoElement.muted = false; // Unmute during playback
		videoElement.play();
		isPlaying = true;
	}


	// Timer Functions
	function startTimer() {
		timer = 0;
		elapsedFormattedTime = "0:00";
		timerInterval = window.setInterval(() => {
			timer += 1;
		}, 1000);
	}

	function resetTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = undefined;
		}
		timer = 0;
		elapsedFormattedTime = "0:00";
	}

	// Format the elapsed time whenever 'timer' changes
	$: {
		const minutes = Math.floor(timer / 60);
		const seconds = timer % 60;
		elapsedFormattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
		if (timer > 120) {
			stopRecording();
		}
	}

	// Optional: Handle video playback events
	$: if (videoElement) {
		const onPlay = () => {
			if (videoElement.srcObject === null) {
				isPlaying = true;
			}
		};
		const onPause = () => {
			isPlaying = false;
		};
		videoElement.addEventListener('play', onPlay);
		videoElement.addEventListener('pause', onPause);

		// Cleanup event listeners when videoElement changes
		onDestroy(() => {
			videoElement.removeEventListener('play', onPlay);
			videoElement.removeEventListener('pause', onPause);
		});
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

	const startOver = () => {
		mediaRecorder = undefined;
		// Reset the video element to initial state if needed
		if (!recording) {
			videoUrl = '';
			videoElement.srcObject = null;
			videoElement.src = '';
			videoElement.load();
			// Restart the live preview
			startPreview();
		}
		// Ensure the timer is reset
		resetTimer();

	}

	let errorME = ''

	const saveVideo = async () => {
		savingVideoState = 'saving';
		try {
			// Step 1: Get the pre-signed URL from your API
			const response = await fetch('https://reviewedbyapi-production.up.railway.app/interview', {
				method: 'POST',
			}).catch(err => {
				throw new Error("INTER ERROR")
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error fetching pre-signed URL: ${response.status} ${errorText}`);
			}

			const data = await response.json();
			const presignedUrl = data.url;

			// Step 2: Upload the blob to S3 using the pre-signed URL
			try {
				await fetch(presignedUrl, {
					method: 'PUT',
					body: blob,
					headers: {
						'Content-Type': mimeType || 'video/webm',
					},
				});
			} catch {
				throw new Error(`Error uploading video: s333`);
			}

			savingVideoState = 'saved';
			sendSuccessEmail($page.url.searchParams.get('email'))
		} catch (err) {
			console.error('An error occurred:', err);
			errorME = err.message;
			savingVideoState = 'error';
		}
	};

	const sendSuccessEmail = async (email: string) => {
		await fetch("https://reviewedbyapi-production.up.railway.app/email/success", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: decodeURIComponent(email)
			})
		});
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

		<!-- Single video element for preview and playback -->
		<!-- svelte-ignore a11y-media-has-caption -->
		<div class="video_container">
			<video
				class="video"
				bind:this={videoElement}
				autoplay
				playsinline
				webkit-playsinline
				controls={!stream}
				muted
			></video>
			{#if recording}
				<div class="video_modal video_modal_stop">
					<StopRecording onClick={stopRecording} elapsedTime={elapsedFormattedTime} />
				</div>
			{/if}
			{#if !isPlaying && !mediaRecorder}
			<div class="video_modal video_modal_complete">
				<StartRecording onPress={startRecording} />
			</div>
			{/if}
			<div class="video_modal video_modal_complete">
				{#if !isPlaying && !recording && mediaRecorder}
						<RecordingComplete
							onSave={saveVideo}
							savingVideoState={savingVideoState}
							playRecording={playRecording}
							startRecording={startOver}
						/>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
    .video_modal_stop {
        bottom: 0;
    }
    .video_modal_complete {
        top: 50%;
        min-width: 280px;
    }
    .video_modal {
        transform: translate(-50%, -50%); /* This centers the modal */
        left: 50%;
        background-color: white;
        position: absolute;
        z-index: 10;
				border-radius: 12px;
    }
    .video_container {
        position: relative;
        width:90%;
        height: 100%;
        margin-left: 5%;
        border-radius: 20px;
        object-fit: cover;
    }
		.question p {
        font-weight: bold;
				text-align: center;
		}
    .question {
        padding-bottom: 20px;
				font-size: 18px;
				display: flex;
				flex-direction: column;
				gap: 10px;
    }
		.inner_container {
				height: 65%;
		}
		.video {
				width: 90%;
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
				padding-bottom: 30px;
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
