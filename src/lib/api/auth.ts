import { client, createTypedClient } from './client';
import type { paths, components } from './types';

/**
 * Authentication domain.
 * 
 * Note: These are using the uniform openapi-fetch approach.
 * These helpers provide typed wrappers for common Better Auth endpoints.
 */

export type User = components['schemas']['User'];
export type Session = components['schemas']['Session'];

export const signUp = async (body: NonNullable<paths['/api/v1/auth/sign-up/email']['post']['requestBody']>['content']['application/json']) => {
  return await client.POST('/api/v1/auth/sign-up/email', {
    body,
  });
};

export const signIn = async (body: NonNullable<paths['/api/v1/auth/sign-in/email']['post']['requestBody']>['content']['application/json']) => {
  return await client.POST('/api/v1/auth/sign-in/email', {
    body,
  });
};

export const signOut = async () => {
  return await client.POST('/api/v1/auth/sign-out', {
    body: {},
  });
};

/**
 * Fetches the current session from the backend.
 *
 * Pass `event.fetch` from `hooks.server.ts` (or any SvelteKit load function)
 * so that the request is made with the same cookies as the incoming request.
 * Falls back to the global client when called from remote functions or the
 * browser where cookie forwarding is handled automatically.
 */
export const getSessionContext = async (fetchFn?: typeof fetch) => {
  if (fetchFn) {
    const sessionClient = createTypedClient(fetchFn);
    return await sessionClient.GET('/api/v1/auth/get-session');
  }
  return await client.GET('/api/v1/auth/get-session');
};

export const listSessions = async () => {
  return await client.GET('/api/v1/auth/list-sessions');
};
