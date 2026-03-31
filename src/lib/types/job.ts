import type { operations } from '$lib/api/types';

// ---------------------------------------------------------------------------
// Derived types from the OpenAPI schema
// ---------------------------------------------------------------------------

/**
 * A single Job as returned by the GET /api/v1/job/ endpoint.
 */
export type Job =
	operations['getApiV1Job']['responses']['200']['content']['application/json'][number];

/**
 * The body accepted by PUT /api/v1/job/{id} for updates.
 */
export type JobUpdateBody = NonNullable<
	operations['putApiV1JobById']['requestBody']
>['content']['application/json'];

/**
 * The body accepted by POST /api/v1/job/ for creation.
 */
export type JobCreateBody = NonNullable<
	operations['postApiV1Job']['requestBody']
>['content']['application/json'];

/**
 * All possible statuses a job application can be in.
 */
export type JobStatus = NonNullable<Job['status']>;

/**
 * Ordered pipeline stages for the Kanban board.
 * "rejected" is intentionally excluded — it has a special drop-zone at the
 * bottom of the board instead of a regular column.
 */
export const KANBAN_COLUMNS: JobStatus[] = [
	'applied',
	'interview hr',
	'interview tech',
	'interview final',
	'test task',
	'offer',
	'accepted'
];

/**
 * All statuses including rejected (used for validation schemas).
 */
export const ALL_STATUSES: JobStatus[] = [...KANBAN_COLUMNS, 'rejected'];

/**
 * Display configuration for each status — label, Tailwind color class, and
 * Lucide icon name.
 */
export const STATUS_CONFIG: Record<
	JobStatus,
	{ label: string; colorClass: string; bgClass: string; iconName: string }
> = {
	applied: {
		label: 'Applied',
		colorClass: 'text-blue-600',
		bgClass: 'bg-blue-500/10',
		iconName: 'send'
	},
	'interview hr': {
		label: 'HR Interview',
		colorClass: 'text-violet-600',
		bgClass: 'bg-violet-500/10',
		iconName: 'phone'
	},
	'interview tech': {
		label: 'Tech Interview',
		colorClass: 'text-indigo-600',
		bgClass: 'bg-indigo-500/10',
		iconName: 'code'
	},
	'interview final': {
		label: 'Final Interview',
		colorClass: 'text-purple-600',
		bgClass: 'bg-purple-500/10',
		iconName: 'users'
	},
	'test task': {
		label: 'Test Task',
		colorClass: 'text-amber-600',
		bgClass: 'bg-amber-500/10',
		iconName: 'file-code'
	},
	offer: {
		label: 'Offer',
		colorClass: 'text-emerald-600',
		bgClass: 'bg-emerald-500/10',
		iconName: 'gift'
	},
	accepted: {
		label: 'Accepted',
		colorClass: 'text-green-600',
		bgClass: 'bg-green-500/10',
		iconName: 'check-circle'
	},
	rejected: {
		label: 'Rejected',
		colorClass: 'text-red-600',
		bgClass: 'bg-red-500/10',
		iconName: 'x-circle'
	}
};
