<script lang="ts">
	import { getDragState } from './kanban-state.svelte';
	import { STATUS_CONFIG, type JobStatus } from '$lib/types/job';
	import { fade } from 'svelte/transition';

	const dragState = getDragState();
	const config = $derived.by(() => {
		const job = dragState.draggedJob;
		if (!job) return null;
		return STATUS_CONFIG[job.status as JobStatus] ?? STATUS_CONFIG['applied'];
	});

	// The ghost should be centered on the touch point
	const style = $derived(
		`left: ${dragState.touchX}px; top: ${dragState.touchY}px; transform: translate(-50%, -50%) rotate(3deg);`
	);
</script>

{#if dragState.isDragging && dragState.draggedJob}
	<div class="kanban-ghost" {style} transition:fade={{ duration: 100 }}>
		<div class="ghost-card">
			<h4 class="ghost-title">{dragState.draggedJob.title}</h4>
			{#if config}
				<span class="status-badge {config.bgClass} {config.colorClass}">
					{config.label}
				</span>
			{/if}
		</div>
	</div>
{/if}

<style>
	.kanban-ghost {
		position: fixed;
		pointer-events: none;
		z-index: 2000;
		width: 200px;
		opacity: 0.8;
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
	}

	.ghost-card {
		background: var(--color-card);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-lg);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.ghost-title {
		font-size: 0.75rem;
		font-weight: 600;
		margin: 0;
		color: var(--color-foreground);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status-badge {
		font-size: 0.625rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		max-width: fit-content;
	}
</style>
