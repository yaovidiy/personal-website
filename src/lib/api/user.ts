import { client } from './client';

/**
 * User domain.
 * Provides typed wrappers for user and resume related endpoints.
 */

export const getCurrentUser = async () => {
  return await client.GET('/api/v1/user/');
};

export const updateResume = async (resumeText: string) => {
  return await client.PUT('/api/v1/user/resume', {
    body: {
      resumeText,
    },
  });
};
