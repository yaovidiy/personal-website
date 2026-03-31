<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { STATUS_CONFIG } from '$lib/types/job';
	import { getDragState, setDragOver } from './kanban-state.svelte';
	import KanbanCard from './KanbanCard.svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let {
		status,
		jobs,
		collapsed = false,
		onStatusChange,
		onCardClick,
		isMobile = false
	}: {
		status: JobStatus;
		jobs: Job[];
		collapsed?: boolean;
		onStatusChange: (jobId: number, newStatus: JobStatus) => void;
		onCardClick: (job: Job) => void;
		isMobile?: boolean;
	} = $props();

	const config = $derived(STATUS_CONFIG[status]);
	const dragState = getDragState();

	const isDropTarget = $derived(
		dragState.isDragging &&
			dragState.dragOverColumn === status &&
			dragState.draggedJob?.status !== status
	);

	// Accordion toggle logic for mobile (Overrideable Derived State Pattern)
	let userExpanded = $state<boolean | null>(null);
	const expanded = $derived(userExpanded ?? !collapsed);

	function toggleExpand() {
		userExpanded = !expanded;
	}

	// ---- Drop zone handlers (HTML5 Drag & Drop) ----

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		setDragOver(status);
	}

	function handleDragLeave(e: DragEvent) {
		// Only clear if actually leaving the column (not entering a child)
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const { clientX, clientY } = e;
		if (
			clientX <= rect.left ||
			clientX >= rect.right ||
			clientY <= rect.top ||
			clientY >= rect.bottom
		) {
			setDragOver(null);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const jobId = e.dataTransfer?.getData('application/x-kanban-job-id');
		if (jobId) {
			onStatusChange(Number(jobId), status);
		}
		setDragOver(null);
	}
</script>

<div
	class="kanban-column"
	class:is-drop-target={isDropTarget}
	class:is-mobile={isMobile}
	role="list"
	aria-label="{config.label} — {jobs.length} job{jobs.length !== 1 ? 's' : ''}"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<!-- Column header -->
	<button
		class="column-header"
		onclick={isMobile ? toggleExpand : undefined}
		aria-expanded={isMobile ? expanded : undefined}
		type="button"
	>
		<div class="header-left">
			<span class="status-dot {config.bgClass}">
				<span class="dot-inner {config.colorClass}"></span>
			</span>
			<h3 class="column-title">{config.label}</h3>
			<span class="job-count">{jobs.length}</span>
		</div>

		{#if isMobile}
			<ChevronDown
				size={16}
				class="chevron {expanded ? 'chevron-rotated' : ''}"
			/>
		{/if}
	</button>

	<!-- Card list -->
	{#if !isMobile || expanded}
		<div class="card-list" transition:slide={{ duration: 200 }}>
			{#if jobs.length === 0}
				<div class="empty-state">
					<span class="empty-text">No jobs</span>
				</div>
			{:else}
				{#each jobs as job (job.id)}
					<div animate:flip={{ duration: 250 }} transition:fade={{ duration: 150 }}>
						<KanbanCard {job} onclick={onCardClick} onStatusChange={onStatusChange} />
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.kanban-column {
		display: flex;
		flex-direction: column;
		min-width: 260px;
		max-width: 320px;
		background: var(--color-muted);
		border-radius: var(--radius-xl);
		border: 2px solid transparent;
		transition:
			border-color 0.2s var(--ease-kinetic),
			background-color 0.2s var(--ease-kinetic);
		overflow: hidden;
	}

	.kanban-column.is-mobile {
		max-width: 100%;
		min-width: 0;
	}

	.kanban-column.is-drop-target {
		border-color: var(--color-primary);
		background: color-mix(in oklch, var(--color-primary) 5%, var(--color-muted));
	}

	.column-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0.875rem;
		border: none;
		background: none;
		cursor: default;
		width: 100%;
		text-align: left;
	}

	.is-mobile .column-header {
		cursor: pointer;
	}

	.is-mobile .column-header:hover {
		background: color-mix(in oklch, var(--color-foreground) 3%, transparent);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.dot-inner {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
	}

	.column-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-foreground);
		font-family: var(--font-sans);
		letter-spacing: 0;
		margin: 0;
	}

	.job-count {
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--color-muted-foreground);
		background: var(--color-background);
		padding: 0.0625rem 0.4375rem;
		border-radius: var(--radius-sm);
		line-height: 1.4;
	}

	:global(.chevron) {
		color: var(--color-muted-foreground);
		transition: transform 0.2s var(--ease-kinetic);
	}

	:global(.chevron-rotated) {
		transform: rotate(180deg);
	}

	.card-list {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0 0.5rem 0.5rem;
		overflow-y: auto;
		max-height: 65vh;
		scrollbar-width: thin;
	}

	.is-mobile .card-list {
		max-height: none;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem 1rem;
	}

	.empty-text {
		font-size: 0.75rem;
		color: var(--color-muted-foreground);
		opacity: 0.6;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.kanban-column {
			border-radius: var(--radius-lg);
		}

		.column-header {
			padding: 0.875rem 1rem;
		}
	}
</style>
