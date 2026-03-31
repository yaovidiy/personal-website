import { client, createTypedClient } from './client';

import type { paths } from './types';

/**
 * Jobs domain.
 * Provides typed wrappers for job-related endpoints.
 */

export const createJobsClient = (fetchFn?: typeof fetch) => {
  const c = fetchFn ? createTypedClient(fetchFn) : client;
  
  return {
    getJobs: async (query?: paths['/api/v1/job/']['get']['parameters']['query']) => {
      return await c.GET('/api/v1/job/', {
        params: { query },
      });
    },
    
    createJob: async (body: paths['/api/v1/job/']['post']['requestBody']['content']['application/json']) => {
      return await c.POST('/api/v1/job/', { body });
    },
    
    updateJob: async (
      id: string,
      body: paths['/api/v1/job/{id}']['put']['requestBody']['content']['application/json'],
    ) => {
      return await c.PUT('/api/v1/job/{id}', {
        params: { path: { id } },
        body,
      });
    },
    
    deleteJob: async (id: string) => {
      return await c.DELETE('/api/v1/job/{id}', {
        params: { path: { id } },
      });
    },
    
    generateSummary: async (id: string) => {
      return await c.POST('/api/v1/job/{id}/summary', {
        params: { path: { id } },
      });
    },
    
    analyzeMatch: async (id: string) => {
      return await c.POST('/api/v1/job/{id}/match', {
        params: { path: { id } },
      });
    },
    
    tailorResume: async (id: string) => {
      return await c.POST('/api/v1/job/{id}/tailor-resume', {
        params: { path: { id } },
      });
    },
  };
};

// Maintaining backward compatibility for external callers (if any) while transitioning to a unified client factory.
// Note: These legacy wrappers are deprecated in favor of createJobsClient.
export const getJobs = async (
  query?: paths['/api/v1/job/']['get']['parameters']['query'],
  fetchFn?: typeof fetch,
) => createJobsClient(fetchFn).getJobs(query);

export const createJob = async (
  body: paths['/api/v1/job/']['post']['requestBody']['content']['application/json'],
  fetchFn?: typeof fetch,
) => createJobsClient(fetchFn).createJob(body);

export const updateJob = async (
  id: string,
  body: paths['/api/v1/job/{id}']['put']['requestBody']['content']['application/json'],
  fetchFn?: typeof fetch,
) => createJobsClient(fetchFn).updateJob(id, body);

export const deleteJob = async (id: string, fetchFn?: typeof fetch) => 
  createJobsClient(fetchFn).deleteJob(id);
