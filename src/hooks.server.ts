import type { Handle } from '@sveltejs/kit';
import { getSessionContext } from '$lib/api/auth';

/**
 * Server hook: on every request, validate the session with the backend and
 * hydrate `event.locals` with the current `user` and `session`.
 *
 * Downstream routes and remote functions can read `event.locals.user` to
 * determine if the request is authenticated, without needing to re-fetch.
 */
export const handle: Handle = async ({ event, resolve }) => {
	try {
		const { data } = await getSessionContext();
		event.locals.user = data?.user ?? null;
		event.locals.session = data?.session ?? null;
	} catch {
		// Network error or backend is unavailable — treat as unauthenticated.
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
