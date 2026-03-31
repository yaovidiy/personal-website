<script lang="ts">
	import { KANBAN_COLUMNS } from '$lib/types/job';
</script>

<div class="skeleton-wrapper">
	<!-- Header skeleton -->
	<div class="skeleton-header">
		<div class="pulse" style="width: 120px; height: 28px; border-radius: var(--radius-md);"></div>
		<div class="skeleton-header-right">
			<div class="pulse" style="width: 180px; height: 32px; border-radius: var(--radius-md);"></div>
			<div class="pulse" style="width: 80px; height: 32px; border-radius: var(--radius-md);"></div>
		</div>
	</div>

	<!-- Columns skeleton -->
	<div class="skeleton-board">
		{#each KANBAN_COLUMNS.slice(0, 5) as _}
			<div class="skeleton-column">
				<div class="skeleton-col-header">
					<div class="pulse" style="width: 14px; height: 14px; border-radius: 50%;"></div>
					<div class="pulse" style="width: 80px; height: 14px; border-radius: var(--radius-sm);"></div>
					<div class="pulse" style="width: 20px; height: 14px; border-radius: var(--radius-sm);"></div>
				</div>
				{#each { length: 2 + Math.floor(Math.random() * 2) } as __}
					<div class="skeleton-card">
						<div class="pulse" style="width: 100%; height: 14px; border-radius: var(--radius-sm);"></div>
						<div class="pulse" style="width: 60%; height: 10px; border-radius: var(--radius-sm);"></div>
						<div class="skeleton-card-footer">
							<div class="pulse" style="width: 50px; height: 16px; border-radius: var(--radius-sm);"></div>
							<div class="pulse" style="width: 30px; height: 10px; border-radius: var(--radius-sm);"></div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.skeleton-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.skeleton-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
	}

	.skeleton-header-right {
		display: flex;
		gap: 0.5rem;
	}

	.skeleton-board {
		display: flex;
		gap: 0.625rem;
		overflow: hidden;
	}

	.skeleton-column {
		min-width: 260px;
		max-width: 320px;
		background: var(--color-muted);
		border-radius: var(--radius-xl);
		padding: 0.75rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.skeleton-col-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.375rem 0.25rem;
	}

	.skeleton-card {
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.skeleton-card-footer {
		display: flex;
		justify-content: space-between;
		margin-top: 0.125rem;
	}

	.pulse {
		background: linear-gradient(
			90deg,
			var(--color-border) 25%,
			color-mix(in oklch, var(--color-border) 50%, transparent) 50%,
			var(--color-border) 75%
		);
		background-size: 200% 100%;
		animation: pulse-move 1.5s ease-in-out infinite;
	}

	@keyframes pulse-move {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@media (max-width: 768px) {
		.skeleton-board {
			flex-direction: column;
		}

		.skeleton-column {
			max-width: 100%;
			min-width: 0;
		}
	}
</style>
