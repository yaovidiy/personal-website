import type { Handle } from '@sveltejs/kit';
import { getSessionContext } from '$lib/api/auth';

/**
 * Server hook: on every request, validate the session with the backend and
 * hydrate `event.locals` with the current `user` and `session`.
 *
 * We pass `event.fetch` to `getSessionContext` so that SvelteKit forwards
 * the incoming request's cookies to the backend automatically, without any
 * manual cookie plumbing.
 *
 * Downstream routes and remote functions can read `event.locals.user` to
 * determine if the request is authenticated, without needing to re-fetch.
 */
export const handle: Handle = async ({ event, resolve }) => {
	try {
		const cookie = event.request.headers.get('cookie');
		const { data } = await getSessionContext({
			headers: cookie ? { cookie } : undefined,
			fetch: event.fetch
		});
		event.locals.user = data?.user ?? null;
		event.locals.session = data?.session ?? null;
	} catch {
		// Network error or backend is unavailable — treat as unauthenticated.
		event.locals.user = null;
		event.locals.session = null;
	}

	// Redirect unauthenticated users away from admin routes
	if (event.url.pathname.startsWith('/admin') && !event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login'
			}
		});
	}

	return resolve(event);
};
