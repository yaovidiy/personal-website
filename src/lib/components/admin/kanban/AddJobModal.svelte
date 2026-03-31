<script lang="ts">
	import { STATUS_CONFIG, KANBAN_COLUMNS } from '$lib/types/job';
	import { addJob } from '$lib/remotes/jobs.remote';
	import { fade } from 'svelte/transition';
	import { X } from '@lucide/svelte';

	let {
		onClose,
		onSuccess
	}: {
		onClose: () => void;
		onSuccess: () => void;
	} = $props();

	let formError = $state<string | null>(null);
	let isSubmitting = $state(false);

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		isSubmitting = true;
		formError = null;

		try {
			await addJob.call(formData);
			onSuccess();
			onClose();
		} catch (err) {
			formError = err instanceof Error ? err.message : 'Failed to add job';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" transition:fade={{ duration: 150 }} onclick={onClose} onkeydown={handleKeyDown}></div>

<!-- Modal -->
<div
	class="modal"
	role="dialog"
	aria-modal="true"
	aria-labelledby="add-job-title"
	transition:fade={{ duration: 150 }}
>
	<div class="modal-header">
		<h3 id="add-job-title" class="modal-title">Add Job</h3>
		<button class="close-btn" onclick={onClose} type="button" aria-label="Close">
			<X size={18} />
		</button>
	</div>

	<form onsubmit={handleSubmit}>
		<div class="form-body">
			<!-- Title -->
			<div class="form-field">
				<label class="form-label" for="add-title">Title *</label>
				<input
					id="add-title"
					name="title"
					type="text"
					class="form-input"
					placeholder="e.g. Senior Frontend Engineer"
					required
				/>
			</div>

			<!-- URL -->
			<div class="form-field">
				<label class="form-label" for="add-url">URL</label>
				<input
					id="add-url"
					name="url"
					type="url"
					class="form-input"
					placeholder="https://..."
				/>
			</div>

			<!-- Description -->
			<div class="form-field">
				<label class="form-label" for="add-desc">Description</label>
				<textarea
					id="add-desc"
					name="description"
					class="form-textarea"
					placeholder="Job description or notes…"
					rows="3"
				></textarea>
			</div>

			<!-- Status -->
			<div class="form-field">
				<label class="form-label" for="add-status">Initial Status</label>
				<select id="add-status" name="status" class="form-select">
					{#each KANBAN_COLUMNS as status (status)}
						<option value={status} selected={status === 'applied'}>
							{STATUS_CONFIG[status].label}
						</option>
					{/each}
				</select>
			</div>

			{#if formError}
				<div class="form-error">{formError}</div>
			{/if}
		</div>

		<div class="form-footer">
			<button class="cancel-btn" type="button" onclick={onClose}>Cancel</button>
			<button class="submit-btn" type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Adding…' : 'Add Job'}
			</button>
		</div>
	</form>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(2px);
		z-index: 50;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 460px;
		max-width: calc(100vw - 2rem);
		max-height: calc(100vh - 2rem);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		z-index: 51;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow:
			0 24px 48px rgba(0, 0, 0, 0.12),
			0 8px 16px rgba(0, 0, 0, 0.06);
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.25rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}

	.modal-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-foreground);
		font-family: var(--font-display);
		margin: 0;
	}

	.close-btn {
		display: flex;
		padding: 0.375rem;
		border: none;
		background: none;
		color: var(--color-muted-foreground);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background 0.15s;
	}

	.close-btn:hover {
		background: var(--color-muted);
	}

	.form-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		overflow-y: auto;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-input,
	.form-textarea,
	.form-select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
		color: var(--color-foreground);
		font-size: 0.875rem;
		font-family: var(--font-sans);
	}

	.form-input:focus,
	.form-textarea:focus,
	.form-select:focus {
		outline: 2px solid var(--color-ring);
		outline-offset: -1px;
	}

	.form-textarea {
		resize: vertical;
		line-height: 1.5;
	}

	.form-error {
		font-size: 0.8125rem;
		color: var(--color-destructive);
		padding: 0.5rem 0.75rem;
		background: color-mix(in oklch, var(--color-destructive) 8%, transparent);
		border-radius: var(--radius-md);
	}

	.form-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-top: 1px solid var(--color-border);
	}

	.cancel-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		background: none;
		color: var(--color-foreground);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.15s;
	}

	.cancel-btn:hover {
		background: var(--color-muted);
	}

	.submit-btn {
		padding: 0.5rem 1rem;
		border: none;
		background: var(--color-primary);
		color: var(--color-on-primary);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-sans);
		transition:
			filter 0.15s,
			transform 0.1s;
	}

	.submit-btn:hover:not(:disabled) {
		filter: brightness(1.1);
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.modal {
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			transform: none;
			width: 100%;
			max-width: 100%;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
</style>
