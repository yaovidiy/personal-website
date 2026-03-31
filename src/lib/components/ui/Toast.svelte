<script lang="ts">
	import { getToastState } from './toast-state.svelte';
	import { fade, fly } from 'svelte/transition';
	import { X, CheckCircle, Info, AlertCircle } from '@lucide/svelte';

	const state = getToastState();
</script>

{#if state && state.toasts.length > 0}
	<div class="toast-container" role="status" aria-live="polite">
		{#each state.toasts as toast (toast.id)}
			<div
				class="toast {toast.type}"
				in:fly={{ y: 20, duration: 300 }}
				out:fade={{ duration: 200 }}
			>
				<div class="toast-icon">
					{#if toast.type === 'success'}
						<CheckCircle size={18} />
					{:else if toast.type === 'error'}
						<AlertCircle size={18} />
					{:else}
						<Info size={18} />
					{/if}
				</div>

				<p class="toast-message">{toast.message}</p>

				<button
					class="toast-close"
					onclick={() => state.remove(toast.id)}
					type="button"
					aria-label="Dismiss notification"
				>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		display: flex;
		flex-direction: column-reverse;
		gap: 0.75rem;
		z-index: 1000;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--color-inverse-surface);
		color: white;
		border-radius: var(--radius-lg);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		pointer-events: auto;
		max-width: 20rem;
		width: max-content;
		font-family: var(--font-sans);
		font-size: 0.875rem;
	}

	.toast.success {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}

	.toast.error {
		background: var(--color-destructive);
		color: white;
	}

	.toast-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 0.125rem;
	}

	.toast-message {
		flex: 1;
		margin: 0;
		line-height: 1.4;
		font-weight: 500;
	}

	.toast-close {
		flex-shrink: 0;
		padding: 0.25rem;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
		opacity: 0.7;
		border-radius: var(--radius-sm);
		transition: opacity 0.2s;
	}

	.toast-close:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.toast-container {
			left: 1rem;
			right: 1rem;
			bottom: 1rem;
			align-items: center;
		}

		.toast {
			width: 100%;
			max-width: none;
		}
	}
</style>
