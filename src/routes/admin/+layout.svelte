<script lang="ts">
	import type { Snippet } from 'svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<AdminSidebar />

	<main class="flex-1 overflow-y-auto bg-background p-6">
		<div class="mx-auto max-w-7xl">
			{@render children?.()}
		</div>
	</main>
</div>
