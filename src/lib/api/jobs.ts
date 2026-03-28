import { client } from './client';

import type { paths } from './types';

/**
 * Jobs domain.
 * Provides typed wrappers for job-related endpoints.
 */

export const getJobs = async (query?: paths['/api/v1/job/']['get']['parameters']['query']) => {
  return await client.GET('/api/v1/job/', {
    params: {
      query,
    },
  });
};

export const createJob = async (body: paths['/api/v1/job/']['post']['requestBody']['content']['application/json']) => {
  return await client.POST('/api/v1/job/', {
    body,
  });
};

export const updateJob = async (id: string, body: paths['/api/v1/job/{id}']['put']['requestBody']['content']['application/json']) => {
  return await client.PUT('/api/v1/job/{id}', {
    params: {
      path: { id },
    },
    body,
  });
};

export const deleteJob = async (id: string) => {
  return await client.DELETE('/api/v1/job/{id}', {
    params: {
      path: { id },
    },
  });
};

export const generateSummary = async (id: string) => {
  return await client.POST('/api/v1/job/{id}/summary', {
    params: {
      path: { id },
    },
  });
};

export const analyzeMatch = async (id: string) => {
  return await client.POST('/api/v1/job/{id}/match', {
    params: {
      path: { id },
    },
  });
};

export const tailorResume = async (id: string) => {
  return await client.POST('/api/v1/job/{id}/tailor-resume', {
    params: {
      path: { id },
    },
  });
};
