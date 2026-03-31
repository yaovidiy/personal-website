import { client } from './client';
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

export const signOut = async (options?: { fetch?: typeof fetch; headers?: Record<string, string> }) => {
  return await client.POST('/api/v1/auth/sign-out', {
    body: {},
    ...options
  });
};

export const getSessionContext = async (options?: { fetch?: typeof fetch; headers?: Record<string, string> }) => {
  return await client.GET('/api/v1/auth/get-session', {
    ...options
  });
};

export const listSessions = async (options?: { fetch?: typeof fetch; headers?: Record<string, string> }) => {
  return await client.GET('/api/v1/auth/list-sessions', {
    ...options
  });
};
