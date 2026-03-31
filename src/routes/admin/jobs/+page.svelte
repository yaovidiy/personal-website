<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { getJobsList, updateJobStatus, updateJobNotes, removeJob } from '$lib/remotes/jobs.remote';
	import { getToastState } from '$lib/components/ui/toast-state.svelte';
	import { KanbanBoard, KanbanSkeleton } from '$lib/components/admin/kanban';
	import JobDetailDrawer from '$lib/components/admin/kanban/JobDetailDrawer.svelte';
	import AddJobModal from '$lib/components/admin/kanban/AddJobModal.svelte';
	import StatusPicker from '$lib/components/admin/kanban/StatusPicker.svelte';

	// ---- Data fetching via remote query ----
	const jobsQuery = getJobsList();
	const toast = getToastState();
	let jobs = $state<Job[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Sync reactive query result into local state for optimistic updates
	$effect(() => {
		const data = jobsQuery.current;
		if (data) {
			jobs = data;
			isLoading = false;
		}
	});

	// ---- UI state ----
	let selectedJob = $state<Job | null>(null);
	let showAddModal = $state(false);
	let statusPickerJob = $state<Job | null>(null);

	// ---- Optimistic status change ----
	async function handleStatusChange(jobId: number, newStatus: JobStatus) {
		// 1. Snapshot for rollback
		const previousJobs = [...jobs];

		// 2. Optimistic update — instant
		jobs = jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j));

		// 3. Update selected job if it's the one being changed
		if (selectedJob && selectedJob.id === jobId) {
			selectedJob = { ...selectedJob, status: newStatus };
		}

		// 4. Server sync in background
		try {
			await updateJobStatus({ id: jobId, status: newStatus });
			toast.add(`Moved to ${newStatus}`, 'success');
		} catch {
			// Rollback
			jobs = previousJobs;
			if (selectedJob && selectedJob.id === jobId) {
				selectedJob = previousJobs.find((j) => j.id === jobId) ?? null;
			}
			toast.add('Failed to update status. Reverted.', 'error');
		}
	}

	// ---- Notes change ----
	async function handleNotesChange(jobId: number, notes: string) {
		const previousJobs = [...jobs];
		jobs = jobs.map((j) => (j.id === jobId ? { ...j, notes } : j));

		try {
			await updateJobNotes({ id: jobId, notes });
		} catch {
			jobs = previousJobs;
			toast.add('Failed to save notes.', 'error');
		}
	}

	// ---- Delete ----
	async function handleDelete(jobId: number) {
		const previousJobs = [...jobs];
		jobs = jobs.filter((j) => j.id !== jobId);

		try {
			await removeJob({ id: jobId });
			toast.add('Job deleted', 'success');
		} catch {
			jobs = previousJobs;
			toast.add('Failed to delete job.', 'error');
		}
	}

	// ---- Card click ----
	function handleCardClick(job: Job) {
		selectedJob = job;
	}

	// ---- Add job success ----
	async function handleAddSuccess() {
		toast.add('Job added!', 'success');
		// Re-read from server to get the new job with server-assigned ID
		try {
			const refreshed = await getJobsList();
			if (refreshed) {
				// The query will auto-update via the reactive effect
			}
		} catch {
			// Will refresh on next query cycle
		}
	}
</script>

<svelte:head>
	<title>Job Board | Admin</title>
	<meta name="description" content="Track your job applications with a visual Kanban board." />
</svelte:head>

<div class="jobs-page">
	{#if isLoading}
		<KanbanSkeleton />
	{:else if error}
		<div class="error-state">
			<p class="error-message">{error}</p>
			<button class="retry-btn" onclick={() => location.reload()} type="button">Retry</button>
		</div>
	{:else}
		<KanbanBoard
			{jobs}
			onStatusChange={handleStatusChange}
			onCardClick={handleCardClick}
			onAddJob={() => (showAddModal = true)}
		/>
	{/if}
</div>

<!-- Detail drawer -->
{#if selectedJob}
	<JobDetailDrawer
		job={selectedJob}
		onClose={() => (selectedJob = null)}
		onStatusChange={handleStatusChange}
		onNotesChange={handleNotesChange}
		onDelete={handleDelete}
	/>
{/if}

<!-- Add modal -->
{#if showAddModal}
	<AddJobModal
		onClose={() => (showAddModal = false)}
		onSuccess={handleAddSuccess}
	/>
{/if}

<!-- Status picker (mobile) -->
{#if statusPickerJob}
	<StatusPicker
		job={statusPickerJob}
		onSelect={handleStatusChange}
		onClose={() => (statusPickerJob = null)}
	/>
{/if}

<style>
	.jobs-page {
		padding: 1rem;
		height: calc(100vh - 4rem);
		display: flex;
		flex-direction: column;
	}

	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	.error-message {
		font-size: 0.875rem;
		color: var(--color-destructive);
	}

	.retry-btn {
		padding: 0.5rem 1rem;
		background: var(--color-primary);
		color: var(--color-on-primary);
		border: none;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-sans);
	}

	@media (max-width: 768px) {
		.jobs-page {
			padding: 0.75rem;
			height: auto;
			min-height: calc(100vh - 4rem);
		}
	}
</style>
