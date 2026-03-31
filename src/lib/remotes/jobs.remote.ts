import { command, form, query } from '$app/server';
import { getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { createJobsClient } from '$lib/api/jobs';
import type { JobStatus } from '$lib/types/job';

// ---------------------------------------------------------------------------
// Read — fetch all jobs for the current user
// ---------------------------------------------------------------------------

/**
 * Reactive query that fetches all job applications.
 */
export const getJobsList = query(async () => {
	const jobsApi = createJobsClient(getRequestEvent().fetch);
	const { data, error } = await jobsApi.getJobs();

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
 */
export const updateJobStatus = command(UpdateStatusSchema, async ({ id, status }) => {
	const jobsApi = createJobsClient(getRequestEvent().fetch);
	const { data: jobs } = await jobsApi.getJobs();
	const job = jobs?.find((j) => j.id === id);

	if (!job) {
		throw new Error(`Job with id ${id} not found`);
	}

	const { error } = await jobsApi.updateJob(String(id), { ...job, status });

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
	const jobsApi = createJobsClient(getRequestEvent().fetch);
	const { data: jobs } = await jobsApi.getJobs();
	const job = jobs?.find((j) => j.id === id);

	if (!job) {
		throw new Error(`Job with id ${id} not found`);
	}

	const { error } = await jobsApi.updateJob(String(id), { ...job, notes });

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
	const jobsApi = createJobsClient(getRequestEvent().fetch);
	const { data: result, error } = await jobsApi.createJob({
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
	const jobsApi = createJobsClient(getRequestEvent().fetch);
	const { error } = await jobsApi.deleteJob(String(id));

	if (error) {
		throw new Error('Failed to delete job');
	}
});
