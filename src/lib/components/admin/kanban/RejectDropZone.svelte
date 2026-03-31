<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { getDragState, setDragOver, endDrag } from './kanban-state.svelte';
	import { Trash2 } from '@lucide/svelte';

	let {
		onReject
	}: {
		onReject: (jobId: number) => void;
	} = $props();

	const dragState = getDragState();

	const isActive = $derived(
		dragState.isDragging && dragState.dragOverColumn === ('rejected' as JobStatus)
	);

	const isVisible = $derived(dragState.isDragging);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		setDragOver('rejected' as JobStatus);
	}

	function handleDragLeave() {
		setDragOver(null);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const jobId = e.dataTransfer?.getData('application/x-kanban-job-id');
		if (jobId) {
			onReject(Number(jobId));
		}
		setDragOver(null);
		endDrag();
	}
</script>

{#if isVisible}
	<div
		class="reject-zone"
		class:is-active={isActive}
		role="button"
		tabindex="-1"
		aria-label="Drop here to reject"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
	>
		<Trash2 size={20} />
		<span class="reject-label">Drop to Reject</span>
	</div>
{/if}

<style>
	.reject-zone {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		margin-top: 0.75rem;
		border: 2px dashed var(--color-destructive);
		border-radius: var(--radius-lg);
		color: var(--color-destructive);
		background: color-mix(in oklch, var(--color-destructive) 5%, transparent);
		font-size: 0.8125rem;
		font-weight: 600;
		transition:
			background-color 0.2s var(--ease-kinetic),
			border-color 0.2s var(--ease-kinetic),
			transform 0.15s var(--ease-kinetic);
		opacity: 0.7;
		animation: fadeIn 0.2s var(--ease-kinetic);
	}

	.reject-zone.is-active {
		background: color-mix(in oklch, var(--color-destructive) 12%, transparent);
		border-style: solid;
		opacity: 1;
		transform: scale(1.02);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 0.7;
			transform: translateY(0);
		}
	}
</style>
