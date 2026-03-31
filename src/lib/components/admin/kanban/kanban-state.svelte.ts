import type { Job, JobStatus } from '$lib/types/job';

// ---------------------------------------------------------------------------
// Drag & drop reactive state (module-level Svelte 5 runes)
// ---------------------------------------------------------------------------

let draggedJob = $state<Job | null>(null);
let dragOverColumn = $state<JobStatus | null>(null);
let isDragging = $state(false);
let touchX = $state(0);
let touchY = $state(0);

/**
 * Begin a drag operation with the given job.
 */
export function startDrag(job: Job, x = 0, y = 0) {
	draggedJob = job;
	isDragging = true;
	touchX = x;
	touchY = y;
}

/**
 * Update current touch coordinates during mobile drag.
 */
export function updateTouchPosition(x: number, y: number) {
	touchX = x;
	touchY = y;
}

/**
 * End the current drag operation and clear all state.
 */
export function endDrag() {
	draggedJob = null;
	dragOverColumn = null;
	isDragging = false;
}

/**
 * Set the column currently being hovered over during a drag.
 */
export function setDragOver(status: JobStatus | null) {
	dragOverColumn = status;
}

/**
 * Read-only reactive getters for the drag state.
 * Components import this to react to drag changes.
 */
export function getDragState() {
	return {
		get draggedJob() {
			return draggedJob;
		},
		get dragOverColumn() {
			return dragOverColumn;
		},
		get isDragging() {
			return isDragging;
		},
		get touchX() {
			return touchX;
		},
		get touchY() {
			return touchY;
		}
	};
}
