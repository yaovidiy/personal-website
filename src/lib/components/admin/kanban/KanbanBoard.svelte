<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { KANBAN_COLUMNS } from '$lib/types/job';
	import KanbanColumn from './KanbanColumn.svelte';
	import KanbanHeader from './KanbanHeader.svelte';
	import RejectDropZone from './RejectDropZone.svelte';
	import KanbanGhost from './KanbanGhost.svelte';

	let {
		jobs,
		onStatusChange,
		onCardClick,
		onAddJob
	}: {
		jobs: Job[];
		onStatusChange: (jobId: number, newStatus: JobStatus) => void;
		onCardClick: (job: Job) => void;
		onAddJob: () => void;
	} = $props();

	// ---- Search / filter ----
	let searchQuery = $state('');

	const filteredJobs = $derived(
		searchQuery.trim() === ''
			? jobs
			: jobs.filter((j) =>
					j.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
				)
	);

	// Active jobs (exclude rejected) for the board columns
	const activeJobs = $derived(filteredJobs.filter((j) => j.status !== 'rejected'));

	// Group jobs by status column
	const grouped = $derived(
		KANBAN_COLUMNS.reduce(
			(acc, status) => {
				acc[status] = activeJobs.filter((j) => j.status === status);
				return acc;
			},
			{} as Record<JobStatus, Job[]>
		)
	);

	// Rejected jobs count (for showing the reject zone context)
	const rejectedCount = $derived(filteredJobs.filter((j) => j.status === 'rejected').length);

	// Total active (non-rejected) job count
	const activeCount = $derived(activeJobs.length);

	// ---- Responsive ----
	let boardEl = $state<HTMLDivElement>();
	let isMobile = $state(false);

	$effect(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		isMobile = mq.matches;

		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});
</script>

<div class="kanban-wrapper" bind:this={boardEl}>
	<KanbanHeader bind:searchQuery jobCount={activeCount} {onAddJob} />

	{#if isMobile}
		<!-- Mobile: single column, accordion layout -->
		<div class="board-mobile" role="region" aria-label="Job application kanban board">
			{#each KANBAN_COLUMNS as status (status)}
				<KanbanColumn
					{status}
					jobs={grouped[status] ?? []}
					{onStatusChange}
					{onCardClick}
					{isMobile}
					collapsed={grouped[status]?.length === 0}
				/>
			{/each}

			<RejectDropZone onReject={(id) => onStatusChange(id, 'rejected')} />

			{#if rejectedCount > 0}
				<div class="rejected-note">
					{rejectedCount} rejected job{rejectedCount !== 1 ? 's' : ''} hidden
				</div>
			{/if}
		</div>
	{:else}
		<!-- Desktop: horizontal scroll layout -->
		<div class="board-desktop" role="region" aria-label="Job application kanban board">
			{#each KANBAN_COLUMNS as status (status)}
				<KanbanColumn
					{status}
					jobs={grouped[status] ?? []}
					{onStatusChange}
					{onCardClick}
					{isMobile}
				/>
			{/each}
		</div>

		<RejectDropZone onReject={(id) => onStatusChange(id, 'rejected')} />

		{#if rejectedCount > 0}
			<div class="rejected-note">
				{rejectedCount} rejected job{rejectedCount !== 1 ? 's' : ''} hidden
			</div>
		{/if}
	{/if}

	<KanbanGhost />
</div>

<style>
	.kanban-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 0.5rem;
	}

	.board-desktop {
		display: flex;
		gap: 0.625rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
		scrollbar-width: thin;
		flex: 1;
	}

	.board-desktop::-webkit-scrollbar {
		height: 6px;
	}

	.board-desktop::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}

	.board-mobile {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.rejected-note {
		text-align: center;
		font-size: 0.6875rem;
		color: var(--color-muted-foreground);
		opacity: 0.6;
		padding: 0.25rem 0 0.5rem;
	}
</style>
