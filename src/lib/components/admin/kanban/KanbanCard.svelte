<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { STATUS_CONFIG, KANBAN_COLUMNS } from '$lib/types/job';
	import { startDrag, endDrag, getDragState, updateTouchPosition } from './kanban-state.svelte';
	import {
		GripVertical,
		ExternalLink,
		BrainCircuit,
		BarChart3,
		Clock
	} from '@lucide/svelte';

	let {
		job,
		onclick,
		onStatusChange
	}: {
		job: Job;
		onclick: (job: Job) => void;
		onStatusChange?: (jobId: number, newStatus: JobStatus) => void;
	} = $props();

	const config = $derived(STATUS_CONFIG[job.status as JobStatus] ?? STATUS_CONFIG['applied']);
	const dragState = getDragState();

	/**
	 * Extract the domain from a URL for display.
	 */
	function getDomain(url: string | null): string | null {
		if (!url) return null;
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return url;
		}
	}

	/**
	 * Compute "time in stage" from lastCommuncationDate.
	 */
	function getTimeInStage(dateStr: Record<string, never> | null): string | null {
		if (!dateStr) return null;
		try {
			const date = new Date(dateStr as unknown as string);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			if (days === 0) return 'Today';
			if (days === 1) return '1 day';
			return `${days} days`;
		} catch {
			return null;
		}
	}

	const domain = $derived(getDomain(job.url));
	const timeInStage = $derived(getTimeInStage(job.lastCommuncationDate));

	// ---- Drag handlers (desktop HTML5 API) ----

	function handleDragStart(e: DragEvent) {
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('application/x-kanban-job-id', String(job.id));
		startDrag(job);
	}

	function handleDragEnd() {
		endDrag();
	}

	// ---- Touch drag handlers (mobile) ----
	let touchTimeout: ReturnType<typeof setTimeout> | null = null;
	let isTouchDragging = $state(false);

	function handleTouchStart(e: TouchEvent) {
		const touch = e.touches[0];
		touchTimeout = setTimeout(() => {
			isTouchDragging = true;
			startDrag(job, touch.clientX, touch.clientY);
			if (navigator.vibrate) navigator.vibrate(50);
		}, 300);
	}

	function handleTouchEnd() {
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			touchTimeout = null;
		}
		if (isTouchDragging) {
			isTouchDragging = false;
			endDrag();
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (isTouchDragging) {
			const touch = e.touches[0];
			updateTouchPosition(touch.clientX, touch.clientY);
		} else if (touchTimeout) {
			// Cancel long-press if user is scrolling
			clearTimeout(touchTimeout);
			touchTimeout = null;
		}
	}

	function handleClick() {
		// Don't open detail if we're dragging
		if (!isTouchDragging) {
			onclick(job);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(job);
		} else if (onStatusChange && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
			e.preventDefault();
			const currentIndex = KANBAN_COLUMNS.indexOf(job.status as JobStatus);
			if (currentIndex === -1) return;

			let nextIndex = currentIndex;
			if (e.key === 'ArrowLeft') nextIndex--;
			if (e.key === 'ArrowRight') nextIndex++;

			if (nextIndex >= 0 && nextIndex < KANBAN_COLUMNS.length) {
				onStatusChange(job.id, KANBAN_COLUMNS[nextIndex]);
			}
		} else if (onStatusChange && (e.key === 'Delete' || e.key === 'Backspace')) {
			e.preventDefault();
			onStatusChange(job.id, 'rejected' as JobStatus);
		}
	}
	const isDragging = $derived(dragState.draggedJob?.id === job.id);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="kanban-card"
	class:is-dragging={isDragging}
	draggable="true"
	role="listitem"
	tabindex="0"
	aria-label="Job: {job.title}"
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	ontouchmove={handleTouchMove}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	<!-- Drag handle -->
	<div class="drag-handle" aria-hidden="true">
		<GripVertical size={14} />
	</div>

	<!-- Content -->
	<div class="card-content">
		<h4 class="card-title">{job.title}</h4>

		{#if domain}
			<div class="card-meta">
				<ExternalLink size={12} />
				<span class="domain">{domain}</span>
			</div>
		{/if}

		<div class="card-footer">
			<span class="status-badge {config.bgClass} {config.colorClass}">
				{config.label}
			</span>

			<div class="card-indicators">
				{#if timeInStage}
					<span class="time-indicator" title="Time in this stage">
						<Clock size={11} />
						{timeInStage}
					</span>
				{/if}

				{#if job.aiSummary}
					<span class="ai-indicator" title="AI Summary available">
						<BrainCircuit size={12} />
					</span>
				{/if}

				{#if job.aiMatchAnalysis}
					<span class="ai-indicator" title="Match analysis available">
						<BarChart3 size={12} />
					</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.kanban-card {
		display: flex;
		gap: 0.375rem;
		padding: 0.75rem;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: grab;
		transition:
			box-shadow 0.2s var(--ease-kinetic),
			transform 0.15s var(--ease-kinetic),
			opacity 0.15s var(--ease-kinetic);
		user-select: none;
		-webkit-user-select: none;
	}

	.kanban-card:hover {
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.06),
			0 1px 4px rgba(0, 0, 0, 0.04);
		transform: translateY(-1px);
	}

	.kanban-card:focus-visible {
		outline: 2px solid var(--color-ring);
		outline-offset: 2px;
	}

	.kanban-card:active {
		cursor: grabbing;
		transform: scale(0.98);
	}

	.kanban-card.is-dragging {
		opacity: 0.5;
		border-color: var(--color-primary);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}

	/* While dragging via HTML5 API the browser adds its own ghost */
	:global(.kanban-card[dragging]) {
		opacity: 0.4;
	}

	.drag-handle {
		display: flex;
		align-items: flex-start;
		padding-top: 2px;
		color: var(--color-muted-foreground);
		flex-shrink: 0;
		opacity: 0.4;
		transition: opacity 0.15s;
	}

	.kanban-card:hover .drag-handle {
		opacity: 0.8;
	}

	.card-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.card-title {
		font-size: 0.8125rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--color-foreground);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-family: var(--font-sans);
		letter-spacing: 0;
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--color-muted-foreground);
		font-size: 0.6875rem;
	}

	.domain {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.375rem;
		margin-top: 0.125rem;
	}

	.status-badge {
		font-size: 0.625rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: var(--radius-sm);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		white-space: nowrap;
	}

	.card-indicators {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.time-indicator {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.625rem;
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	.ai-indicator {
		display: flex;
		align-items: center;
		color: var(--color-primary);
		opacity: 0.7;
	}

	/* Mobile: larger touch targets */
	@media (max-width: 768px) {
		.kanban-card {
			padding: 1rem;
		}

		.card-title {
			font-size: 0.875rem;
		}

		.drag-handle {
			display: none;
		}
	}
</style>
