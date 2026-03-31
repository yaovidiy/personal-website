<script lang="ts">
	import type { Snippet } from 'svelte';
	import { initToastState } from '$lib/components/ui/toast-state.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();

	initToastState();
</script>

{@render children?.()}
<Toast />
