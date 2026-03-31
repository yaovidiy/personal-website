import createClient from 'openapi-fetch';
import type { paths } from './types';
import { PUBLIC_API_URL } from '$env/static/public';

/**
 * Configure the API client.
 *
 * credentials: 'include' ensures that the session cookie from Better Auth
 * is sent along with each request to your backend.
 */
/**
 * Base configuration for the API client.
 */
const BASE_CONFIG = {
	baseUrl: PUBLIC_API_URL || 'http://localhost:3000',
	credentials: 'include' as const,
	headers: {
		'Content-Type': 'application/json'
	}
};

/**
 * Factory to create a typed API client.
 *
 * If a custom fetch is provided (e.g. event.fetch in SvelteKit),
 * it will be used for all requests.
 */
export const createTypedClient = (fetchFn?: typeof fetch) => {
	return createClient<paths>({
		...BASE_CONFIG,
		fetch: fetchFn
	});
};

/**
 * Default global client instance.
 */
export const client = createTypedClient();
