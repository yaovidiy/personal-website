import createClient from 'openapi-fetch';
import type { paths } from './types';
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Configure the API client.
 * 
 * credentials: 'include' ensures that the session cookie from Better Auth
 * is sent along with each request to your backend.
 */
export const client = createClient<paths>({
  baseUrl: PUBLIC_API_URL || 'http://localhost:3000',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});
