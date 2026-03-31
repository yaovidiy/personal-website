import { command, form, query } from '$app/server';
import { getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { getJobs, createJob, updateJob, deleteJob } from '$lib/api/jobs';
import type { JobStatus } from '$lib/types/job';

// ---------------------------------------------------------------------------
// Read — fetch all jobs for the current user
// ---------------------------------------------------------------------------

/**
 * Reactive query that fetches all job applications.
 *
 * Uses `event.fetch` to forward cookies so the backend can identify the
 * authenticated user.
 */
export const getJobsList = query(async () => {
	const event = getRequestEvent();
	const { data, error } = await getJobs(undefined, event.fetch);

	if (error) {
		throw new Error('Failed to fetch jobs');
	}

	return data ?? [];
});

// ---------------------------------------------------------------------------
// Update status — optimistic-update friendly command
// ---------------------------------------------------------------------------

const UpdateStatusSchema = v.object({
	id: v.number(),
	status: v.picklist([
		'rejected',
		'applied',
		'interview hr',
		'interview tech',
		'interview final',
		'test task',
		'offer',
		'accepted'
	] satisfies JobStatus[])
});

/**
 * Update only the status of a job.
 *
 * Since the API only exposes PUT (full replacement) we fetch the current
 * job first, merge the new status, and send the complete object back.
 * This will be simplified once PATCH support lands on the backend.
 */
export const updateJobStatus = command(UpdateStatusSchema, async ({ id, status }) => {
	const event = getRequestEvent();
	const { data: jobs } = await getJobs(undefined, event.fetch);
	const job = jobs?.find((j) => j.id === id);

	if (!job) {
		throw new Error(`Job with id ${id} not found`);
	}

	const { error } = await updateJob(String(id), { ...job, status });

	if (error) {
		throw new Error('Failed to update job status');
	}
});

// ---------------------------------------------------------------------------
// Update notes
// ---------------------------------------------------------------------------

const UpdateNotesSchema = v.object({
	id: v.number(),
	notes: v.string()
});

/**
 * Update only the notes field of a job. Same fetch-merge-put pattern.
 */
export const updateJobNotes = command(UpdateNotesSchema, async ({ id, notes }) => {
	const event = getRequestEvent();
	const { data: jobs } = await getJobs(undefined, event.fetch);
	const job = jobs?.find((j) => j.id === id);

	if (!job) {
		throw new Error(`Job with id ${id} not found`);
	}

	const { error } = await updateJob(String(id), { ...job, notes });

	if (error) {
		throw new Error('Failed to update job notes');
	}
});

// ---------------------------------------------------------------------------
// Create — add a new job application
// ---------------------------------------------------------------------------

const AddJobSchema = v.object({
	title: v.pipe(v.string(), v.minLength(1, 'Title is required.')),
	url: v.optional(v.pipe(v.string(), v.url('Please enter a valid URL.')), ''),
	description: v.optional(v.string(), ''),
	status: v.optional(
		v.picklist([
			'rejected',
			'applied',
			'interview hr',
			'interview tech',
			'interview final',
			'test task',
			'offer',
			'accepted'
		] satisfies JobStatus[]),
		'applied'
	)
});

export const addJob = form(AddJobSchema, async (data) => {
	const { data: result, error } = await createJob({
		title: data.title,
		url: data.url || null,
		description: data.description || null,
		status: data.status
	});

	if (!result || error) {
		throw new Error('Failed to create job.');
	}

	return result;
});

// ---------------------------------------------------------------------------
// Delete — remove a job application
// ---------------------------------------------------------------------------

const RemoveJobSchema = v.object({
	id: v.number()
});

export const removeJob = command(RemoveJobSchema, async ({ id }) => {
	const { error } = await deleteJob(String(id));

	if (error) {
		throw new Error('Failed to delete job');
	}
});
