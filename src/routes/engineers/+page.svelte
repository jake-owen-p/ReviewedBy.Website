<script lang="ts">
	import Page from "$lib/Page.svelte";
	import { engineerSetup } from '$lib/constants';
	import { inject } from '@vercel/analytics';
	inject({ mode: 'production' });

</script>

<Page config={engineerSetup}></Page>
