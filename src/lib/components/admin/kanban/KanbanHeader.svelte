<script lang="ts">
	import { Search, Plus } from '@lucide/svelte';

	let {
		searchQuery = $bindable(''),
		jobCount,
		onAddJob
	}: {
		searchQuery: string;
		jobCount: number;
		onAddJob: () => void;
	} = $props();
</script>

<div class="kanban-header">
	<div class="header-left">
		<h2 class="page-title">Job Board</h2>
		<span class="job-count-badge">{jobCount} active</span>
	</div>

	<div class="header-actions">
		<div class="search-wrapper">
			<Search size={14} />
			<input
				type="search"
				class="search-input"
				placeholder="Filter jobs…"
				bind:value={searchQuery}
				aria-label="Filter jobs by title"
			/>
		</div>

		<button class="add-btn" onclick={onAddJob} type="button">
			<Plus size={16} />
			<span class="btn-label">Add Job</span>
		</button>
	</div>
</div>

<style>
	.kanban-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5rem 0;
		flex-wrap: wrap;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.page-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground);
		margin: 0;
		font-family: var(--font-display);
		letter-spacing: -0.02em;
	}

	.job-count-badge {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-muted-foreground);
		background: var(--color-muted);
		padding: 0.125rem 0.5rem;
		border-radius: var(--radius-sm);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.search-wrapper {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.375rem 0.625rem;
		transition: border-color 0.15s var(--ease-kinetic);
		color: var(--color-muted-foreground);
	}

	.search-wrapper:focus-within {
		border-color: var(--color-ring);
	}

	.search-input {
		border: none;
		background: none;
		font-size: 0.8125rem;
		color: var(--color-foreground);
		outline: none;
		width: 150px;
		font-family: var(--font-sans);
	}

	.search-input::placeholder {
		color: var(--color-muted-foreground);
		opacity: 0.6;
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: var(--color-primary);
		color: var(--color-on-primary);
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.15s var(--ease-kinetic),
			transform 0.1s var(--ease-kinetic);
		min-height: 36px;
		font-family: var(--font-sans);
	}

	.add-btn:hover {
		filter: brightness(1.1);
	}

	.add-btn:active {
		transform: scale(0.97);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.kanban-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-actions {
			width: 100%;
		}

		.search-wrapper {
			flex: 1;
		}

		.search-input {
			width: 100%;
		}

		.btn-label {
			display: none;
		}

		.add-btn {
			padding: 0.375rem;
			min-width: 36px;
			justify-content: center;
		}
	}
</style>
