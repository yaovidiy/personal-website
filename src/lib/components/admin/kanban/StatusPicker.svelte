<script lang="ts">
	import type { Job, JobStatus } from '$lib/types/job';
	import { STATUS_CONFIG, ALL_STATUSES } from '$lib/types/job';
	import { fade } from 'svelte/transition';

	let {
		job,
		onSelect,
		onClose
	}: {
		job: Job;
		onSelect: (jobId: number, status: JobStatus) => void;
		onClose: () => void;
	} = $props();

	function handleSelect(status: JobStatus) {
		if (status !== job.status) {
			onSelect(job.id, status);
		}
		onClose();
	}

	function handleBackdrop() {
		onClose();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" transition:fade={{ duration: 150 }} onclick={handleBackdrop} onkeydown={handleKeyDown}></div>

<!-- Bottom sheet -->
<div
	class="status-picker"
	role="dialog"
	aria-modal="true"
	aria-label="Change job status"
	transition:fade={{ duration: 150 }}
>
	<div class="picker-header">
		<h4 class="picker-title">Move to…</h4>
		<span class="picker-subtitle">{job.title}</span>
	</div>

	<div class="status-list" role="listbox">
		{#each ALL_STATUSES as status}
			{@const config = STATUS_CONFIG[status]}
			<button
				class="status-option"
				class:is-current={status === job.status}
				role="option"
				aria-selected={status === job.status}
				onclick={() => handleSelect(status)}
				type="button"
			>
				<span class="option-dot {config.bgClass}">
					<span class="dot-inner {config.colorClass}"></span>
				</span>
				<span class="option-label">{config.label}</span>
				{#if status === job.status}
					<span class="current-badge">Current</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(2px);
		z-index: 50;
	}

	.status-picker {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 51;
		background: var(--color-card);
		border-top-left-radius: var(--radius-2xl);
		border-top-right-radius: var(--radius-2xl);
		padding: 1rem;
		padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
		max-height: 70vh;
		overflow-y: auto;
		box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.12);
	}

	.picker-header {
		padding: 0.25rem 0.5rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 0.5rem;
	}

	.picker-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-foreground);
		margin: 0;
		font-family: var(--font-display);
	}

	.picker-subtitle {
		font-size: 0.75rem;
		color: var(--color-muted-foreground);
		display: block;
		margin-top: 0.125rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status-list {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.status-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: none;
		background: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		width: 100%;
		text-align: left;
		transition: background 0.15s var(--ease-kinetic);
		min-height: 44px;
	}

	.status-option:hover {
		background: var(--color-muted);
	}

	.status-option.is-current {
		background: var(--color-muted);
	}

	.option-dot {
		width: 1.5rem;
		height: 1.5rem;
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

	.option-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-foreground);
		flex: 1;
	}

	.current-badge {
		font-size: 0.625rem;
		font-weight: 700;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
