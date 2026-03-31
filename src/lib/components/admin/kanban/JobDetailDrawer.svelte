<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { STATUS_CONFIG, ALL_STATUSES } from '$lib/types/job';
	import { fade, fly } from 'svelte/transition';
	import {
		X,
		ExternalLink,
		Calendar,
		MessageSquare,
		BrainCircuit,
		BarChart3,
		Trash2
	} from '@lucide/svelte';

	let {
		job,
		onClose,
		onStatusChange,
		onNotesChange,
		onDelete
	}: {
		job: Job;
		onClose: () => void;
		onStatusChange: (jobId: number, newStatus: JobStatus) => void;
		onNotesChange: (jobId: number, notes: string) => void;
		onDelete: (jobId: number) => void;
	} = $props();

	// Initialize local mutable copy of notes for editing
	// svelte-ignore state_referenced_locally
	let notesValue = $state(job.notes ?? '');
	let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	// ---- Responsive ----
	let isMobile = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		isMobile = mq.matches;
		const handler = (e: MediaQueryListEvent) => { isMobile = e.matches; };
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	// ---- Debounced notes save ----
	function handleNotesInput() {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			saveStatus = 'saving';
			onNotesChange(job.id, notesValue);
			setTimeout(() => {
				saveStatus = 'saved';
				setTimeout(() => { saveStatus = 'idle'; }, 2000);
			}, 500);
		}, 500);
	}

	function handleStatusSelect(e: Event) {
		const select = e.target as HTMLSelectElement;
		onStatusChange(job.id, select.value as JobStatus);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	function handleDelete() {
		if (confirm(`Delete "${job.title}"? This cannot be undone.`)) {
			onDelete(job.id);
			onClose();
		}
	}

	function formatDate(dateVal: unknown): string | null {
		if (!dateVal) return null;
		try {
			return new Date(dateVal as string).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return null;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="drawer-backdrop"
	transition:fade={{ duration: 200 }}
	onclick={onClose}
	onkeydown={handleKeyDown}
></div>

<!-- Drawer -->
<div
	class="drawer"
	class:is-mobile={isMobile}
	role="dialog"
	aria-modal="true"
	aria-labelledby="drawer-title"
	transition:fly={isMobile ? { y: 300, duration: 250 } : { x: 400, duration: 250 }}
>
	<!-- Header -->
	<div class="drawer-header">
		<h3 id="drawer-title" class="drawer-title">{job.title}</h3>
		<button class="close-btn" onclick={onClose} type="button" aria-label="Close drawer">
			<X size={18} />
		</button>
	</div>

	<div class="drawer-body">
		<!-- Status selector -->
		<div class="field-group">
			<label class="field-label" for="job-status">Status</label>
			<select id="job-status" class="status-select" value={job.status ?? 'applied'} onchange={handleStatusSelect}>
				{#each ALL_STATUSES as status (status)}
					<option value={status}>{STATUS_CONFIG[status].label}</option>
				{/each}
			</select>
		</div>

		<!-- URL -->
		{#if job.url}
			<div class="field-group">
				<span class="field-label">Link</span>
				<!-- eslint-disable-next-line svelte/valid-resolve -->
				<a href="{job.url}" target="_blank" rel="noopener noreferrer" class="job-link">
					<ExternalLink size={14} />
					{job.url}
				</a>
			</div>
		{/if}

		<!-- Description -->
		{#if job.description}
			<div class="field-group">
				<span class="field-label">Description</span>
				<p class="description-text">{job.description}</p>
			</div>
		{/if}

		<!-- Dates -->
		<div class="dates-row">
			{#if job.nextEventDate}
				<div class="date-item">
					<Calendar size={13} />
					<span>Next: {formatDate(job.nextEventDate) ?? '—'}</span>
				</div>
			{/if}
			{#if job.lastCommuncationDate}
				<div class="date-item">
					<MessageSquare size={13} />
					<span>Last contact: {formatDate(job.lastCommuncationDate) ?? '—'}</span>
				</div>
			{/if}
		</div>

		<!-- Notes -->
		<div class="field-group">
			<div class="notes-header">
				<label class="field-label" for="job-notes">Notes</label>
				{#if saveStatus === 'saving'}
					<span class="save-indicator saving">Saving…</span>
				{:else if saveStatus === 'saved'}
					<span class="save-indicator saved">Saved ✓</span>
				{/if}
			</div>
			<textarea
				id="job-notes"
				class="notes-textarea"
				bind:value={notesValue}
				oninput={handleNotesInput}
				placeholder="Add notes…"
				rows="4"
			></textarea>
		</div>

		<!-- AI Sections -->
		{#if job.aiSummary}
			<details class="ai-section">
				<summary class="ai-summary-toggle">
					<BrainCircuit size={14} />
					AI Summary
				</summary>
				<div class="ai-content">{job.aiSummary}</div>
			</details>
		{/if}

		{#if job.aiMatchAnalysis}
			<details class="ai-section">
				<summary class="ai-summary-toggle">
					<BarChart3 size={14} />
					Match Analysis
				</summary>
				<div class="ai-content">{job.aiMatchAnalysis}</div>
			</details>
		{/if}
	</div>

	<!-- Footer -->
	<div class="drawer-footer">
		<button class="delete-btn" onclick={handleDelete} type="button">
			<Trash2 size={14} />
			Delete
		</button>
	</div>
</div>

<style>
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(2px);
		z-index: 40;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 480px;
		max-width: 100vw;
		background: var(--color-card);
		border-left: 1px solid var(--color-border);
		z-index: 41;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.drawer.is-mobile {
		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 80vh;
		border-left: none;
		border-top: 1px solid var(--color-border);
		border-top-left-radius: var(--radius-2xl);
		border-top-right-radius: var(--radius-2xl);
	}

	.drawer-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.25rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.drawer-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-foreground);
		font-family: var(--font-display);
		margin: 0;
		line-height: 1.3;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.375rem;
		border: none;
		background: none;
		color: var(--color-muted-foreground);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background 0.15s;
		flex-shrink: 0;
	}

	.close-btn:hover {
		background: var(--color-muted);
	}

	.drawer-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field-label {
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
		color: var(--color-foreground);
		font-size: 0.875rem;
		font-family: var(--font-sans);
		cursor: pointer;
	}

	.job-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--color-primary);
		font-size: 0.8125rem;
		word-break: break-all;
		text-decoration: none;
	}

	.job-link:hover {
		text-decoration: underline;
	}

	.description-text {
		font-size: 0.8125rem;
		color: var(--color-foreground);
		line-height: 1.6;
		margin: 0;
		white-space: pre-wrap;
	}

	.dates-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.date-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		color: var(--color-muted-foreground);
	}

	.notes-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.notes-textarea {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
		color: var(--color-foreground);
		font-size: 0.8125rem;
		font-family: var(--font-sans);
		resize: vertical;
		line-height: 1.5;
	}

	.notes-textarea:focus {
		outline: 2px solid var(--color-ring);
		outline-offset: -1px;
	}

	.save-indicator {
		font-size: 0.625rem;
		font-weight: 600;
	}

	.save-indicator.saving {
		color: var(--color-muted-foreground);
	}

	.save-indicator.saved {
		color: var(--color-primary);
	}

	.ai-section {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.ai-summary-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-foreground);
		cursor: pointer;
		transition: background 0.15s;
	}

	.ai-summary-toggle:hover {
		background: var(--color-muted);
	}

	.ai-content {
		padding: 0.75rem;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-foreground);
		border-top: 1px solid var(--color-border);
		white-space: pre-wrap;
	}

	.drawer-footer {
		padding: 0.75rem 1.25rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
	}

	.delete-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-destructive);
		background: none;
		color: var(--color-destructive);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
		font-family: var(--font-sans);
	}

	.delete-btn:hover {
		background: var(--color-destructive);
		color: white;
	}
</style>
