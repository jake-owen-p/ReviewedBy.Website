<script lang="ts">
	import { inject } from '@vercel/analytics';
	inject({ mode: 'production' });

	import Page from "$lib/Page.svelte";
	import { gradsSetup } from '$lib/constants';
	import { onMount } from 'svelte';
	let ready = false;

	onMount(() => {
		document.documentElement.setAttribute('data-theme', 'grads');
		setTimeout(() => {
			ready = true;
		}, 100)
	});
// 	from here i want to be able to control oit

</script>


{#if ready}
<Page config={gradsSetup}></Page>
{/if}